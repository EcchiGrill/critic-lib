import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './models/auth/auth.module';
import { BookModule } from './models/book/book.module';
import { ReviewModule } from './models/review/review.module';
import { StatusModule } from './status/status.module';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule,
    PrismaModule,
    AuthModule,
    BookModule,
    ReviewModule,
    StatusModule,
    CloudinaryModule,
    LoggerModule,
  ],
})
export class AppModule {}
