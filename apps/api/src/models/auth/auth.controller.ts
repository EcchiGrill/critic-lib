import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import type { JwtPayload } from './types/jwtPayload';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Express } from 'express';
import { uploadImagePipe } from '../../cloudinary/upload-image.pipe';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import {
  ConfirmEmailDto,
  ResendConfirmationDto,
} from './dto/email-confirmation.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { GoogleProfileDto } from './dto/google-profile';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @UseGuards(RateLimitGuard)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateMe(@CurrentUser() user: JwtPayload, @Body() body: UpdateMeDto) {
    return this.authService.updateProfile(user.sub, body);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.deleteProfile(user.sub);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Avatar image' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile(uploadImagePipe) file: Express.Multer.File
  ) {
    return this.authService.uploadAvatar(user.sub, file);
  }

  @Post('forgot-password')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Email address',
        },
      },
    },
  })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token', 'password'],
      properties: {
        token: { type: 'string', description: 'Reset token' },
        password: { type: 'string', description: 'New password' },
      },
    },
  })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @Post('confirm-email')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token'],
      properties: {
        token: { type: 'string', description: 'Confirmation token' },
      },
    },
  })
  confirmEmail(@Body() body: ConfirmEmailDto) {
    return this.authService.confirmEmail(body.token);
  }

  @Post('resend-confirmation')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Email address',
        },
      },
    },
  })
  resendConfirmation(@Body() body: ResendConfirmationDto) {
    return this.authService.resendConfirmation(body);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Post('google/callback')
  async googleOAuthCallback(
    @Body()
    body: GoogleProfileDto
  ) {
    return await this.authService.googleOAuth(body);
  }
}
