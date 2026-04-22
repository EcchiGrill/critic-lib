import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import type { Express } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import { ResendConfirmationDto } from './dto/email-confirmation.dto';
import type { JwtPayload } from './types/jwtPayload';
import { GoogleProfileDto } from './dto/google-profile';

const emailConfirmExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

const userPublicSelect = {
  id: true,
  username: true,
  email: true,
  avatar: true,
  role: true,
  isEmailConfirmed: true,
  favoriteBooks: {
    select: {
      id: true,
    },
  },
  readBooks: {
    select: {
      id: true,
    },
  },
  reviews: {
    select: {
      id: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cloudinary: CloudinaryService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  async register(body: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const password = await bcrypt.hash(body.password, 10);
    const confirmToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(confirmToken, 10);

    const user = await this.prisma.user.create({
      data: {
        ...body,
        password,
        emailConfirmToken: hashedToken,
        emailConfirmExpires,
      },
    });

    try {
      await this.emailService.sendEmailConfirmation(user.email, confirmToken);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return {
      message:
        'Registration successful. Please check your email to confirm your account.',
      email: user.email,
    };
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      await this.prisma.loginAttempt.create({
        data: {
          email: body.email,
          userId: null,
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailConfirmed) {
      throw new BadRequestException(
        'Please confirm your email before logging in'
      );
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.password || ''
    );
    if (!isPasswordValid) {
      await this.prisma.loginAttempt.create({
        data: {
          email: body.email,
          userId: user.id,
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.loginAttempt.deleteMany({
      where: { email: body.email },
    });

    try {
      await this.emailService.sendLoginConfirmation(user.email, user.username);
    } catch (error) {
      console.error('Failed to send login confirmation email:', error);
    }

    return this.buildAuthResponse(user.id, user.email);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      ...user,
      favoriteBooks: user.favoriteBooks.map((book) => book.id),
      readBooks: user.readBooks.map((book) => book.id),
      reviews: user.reviews.map((review) => review.id),
    };
  }

  async updateProfile(userId: string, body: UpdateMeDto) {
    if (body.email) {
      const taken = await this.prisma.user.findFirst({
        where: { email: body.email, NOT: { id: userId } },
      });
      if (taken) {
        throw new ConflictException('Email already in use');
      }
    }

    const data: Prisma.UserUpdateInput = {
      ...body,
      ...(body.password && { password: await bcrypt.hash(body.password, 10) }),
    };
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: userPublicSelect,
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    await this.getProfile(userId);
    const url = await this.cloudinary.uploadBuffer(file.buffer, 'avatars');
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: url },
      select: userPublicSelect,
    });
  }

  private buildAuthResponse(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return { message: 'If email exists, password reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetTokenHash,
        passwordResetExpires: resetExpires,
      },
    });

    try {
      await this.emailService.sendPasswordReset(user.email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }

    return { message: 'Password reset link has been sent to your email' };
  }

  async resetPassword(body: ResetPasswordDto) {
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(body.token)
      .digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: resetTokenHash,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  }

  async deleteProfile(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'Profile deleted successfully' };
  }

  async confirmEmail(token: string) {
    const users = await this.prisma.user.findMany({
      where: {
        isEmailConfirmed: false,
        emailConfirmToken: {
          not: null,
        },
        emailConfirmExpires: {
          gt: new Date(),
        },
      },
    });

    let matchedUser: User | null = null;
    for (const user of users) {
      if (user.emailConfirmToken) {
        const isTokenValid = await bcrypt.compare(
          token,
          user.emailConfirmToken
        );
        if (isTokenValid) {
          matchedUser = user;
          break;
        }
      }
    }

    if (!matchedUser) {
      throw new BadRequestException('Invalid or expired confirmation token');
    }

    await this.prisma.user.update({
      where: { id: matchedUser.id },
      data: {
        isEmailConfirmed: true,
        emailConfirmToken: null,
      },
    });

    this.emailService
      .sendEmailConfirmation(matchedUser.email, matchedUser.username)
      .catch((err) => {
        console.error('Failed to send welcome email:', err);
      });

    return { message: 'Email confirmed successfully. You can now login.' };
  }

  async resendConfirmation(body: ResendConfirmationDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return { message: 'If email exists, confirmation link has been sent' };
    }

    if (user.isEmailConfirmed) {
      return { message: 'Email is already confirmed' };
    }

    const confirmToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(confirmToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailConfirmToken: hashedToken,
        emailConfirmExpires,
      },
    });

    try {
      await this.emailService.sendEmailConfirmation(user.email, confirmToken);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }

    return { message: 'Confirmation link has been sent to your email' };
  }

  async googleOAuth(profile: GoogleProfileDto) {
    let user = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });

    if (user) {
      try {
        await this.emailService.sendLoginConfirmation(
          user.email,
          user.username
        );
      } catch (error) {
        console.error('Failed to send login confirmation email:', error);
      }

      return this.buildAuthResponse(user.id, user.email);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) {
      await this.prisma.oAuthAccount.create({
        data: {
          userId: existingUser.id,
          provider: 'google',
          providerAccountId: profile.googleId,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        },
      });

      user = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId: profile.googleId,
          googleEmail: profile.email,
          isEmailConfirmed: true,
        },
      });

      try {
        await this.emailService.sendLoginConfirmation(
          user.email,
          user.username
        );
      } catch (error) {
        console.error('Failed to send login confirmation email:', error);
      }

      return this.buildAuthResponse(user.id, user.email);
    }

    user = await this.prisma.user.create({
      data: {
        username: profile.name || profile.email.split('@')[0] || '',
        email: profile.email || '',
        googleId: profile.googleId,
        googleEmail: profile.email,
        avatar: profile.picture,
        isEmailConfirmed: true,
        password: null,
      },
    });

    await this.prisma.oAuthAccount.create({
      data: {
        userId: user.id,
        provider: 'google',
        providerAccountId: profile.googleId,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      },
    });

    try {
      await this.emailService.sendLoginConfirmation(user.email, user.username);
    } catch (error) {
      console.error('Failed to send login confirmation email:', error);
    }

    return this.buildAuthResponse(user.id, user.email);
  }
}
