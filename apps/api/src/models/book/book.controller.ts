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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwtPayload';
import { FavoriteBookDto } from './dto/favorite-book.dto';
import { ReadBookDto } from './dto/read-book.dto';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks() {
    return this.bookService.getBooks();
  }

  @Get('favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getFavoriteBooks(@CurrentUser() user: JwtPayload) {
    return this.bookService.getFavoriteBooks(user.sub);
  }

  @Get('read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getReadBooks(@CurrentUser() user: JwtPayload) {
    return this.bookService.getReadBooks(user.sub);
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

  @Patch(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  favoriteBook(
    @Param('id') id: string,
    @Body() body: FavoriteBookDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.bookService.favoriteBook(id, user.sub, body);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  readBook(
    @Param('id') id: string,
    @Body() body: ReadBookDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.bookService.readBook(id, user.sub, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }
}
