import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  imports: [AuthModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
