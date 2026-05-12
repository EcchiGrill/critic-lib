import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { EmailModule } from '../../email/email.module';

@Module({
  imports: [
    PassportModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    GoogleAuthGuard,
    RateLimitGuard,
    GoogleStrategy,
  ],
  exports: [AuthService, JwtAuthGuard, GoogleAuthGuard, RateLimitGuard],
})
export class AuthModule {}
