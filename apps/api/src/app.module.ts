import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './models/auth/auth.module';
import { BookModule } from './models/book/book.module';
import { ReviewModule } from './models/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule,
    PrismaModule,
    AuthModule,
    BookModule,
    ReviewModule,
  ],
})
export class AppModule {}
