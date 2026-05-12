import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly MAX_ATTEMPTS = 5;
  private readonly ATTEMPTS_DELAY = 10 * 60 * 1000; // 10 minutes

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body?.email;

    if (!email) {
      return true;
    }

    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - this.ATTEMPTS_DELAY);

    const attemptCount = await this.prisma.loginAttempt.count({
      where: {
        email,
        timestamp: {
          gte: tenMinutesAgo,
        },
      },
    });

    if (attemptCount >= this.MAX_ATTEMPTS) {
      throw new HttpException(
        'Too many login attempts. Please try again in 10 minutes.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
