import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Express } from 'express';
import { uploadImagePipe } from '../../cloudinary/upload-image.pipe';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks() {
    return this.bookService.getBooks();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createBook(@Body() body: CreateBookDto) {
    return this.bookService.createBook(body);
  }

  @Post(':id/cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Cover image' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(
    @Param('id') id: string,
    @UploadedFile(uploadImagePipe) file: Express.Multer.File
  ) {
    return this.bookService.uploadCover(id, file);
  }

  @Get(':id')
  getBook(@Param('id') id: string) {
    return this.bookService.getBook(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateBook(@Param('id') id: string, @Body() body: UpdateBookDto) {
    return this.bookService.updateBook(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }
}
