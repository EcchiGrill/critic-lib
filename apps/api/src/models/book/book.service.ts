import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Express } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

const bookInclude = {
  author: true,
  genres: true,
  reviews: {
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  },
} satisfies Prisma.BookInclude;

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async createBook(dto: CreateBookDto) {
    await this.ensureAuthorExists(dto.authorId);
    if (dto.genreIds?.length) {
      await this.ensureGenresExist(dto.genreIds);
    }
    const book = await this.prisma.book.create({
      data: {
        title: dto.title,
        authorId: dto.authorId,
        description: dto.description,
        pages: dto.pages,
        cover: dto.cover,
        publishedAt: new Date(dto.publishedAt),
        genres:
          dto.genreIds && dto.genreIds.length > 0
            ? { connect: dto.genreIds.map((id) => ({ id })) }
            : undefined,
      },
      include: bookInclude,
    });
    return book;
  }

  async getBooks() {
    const books = await this.prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: bookInclude,
    });
    return books;
  }

  async getBook(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: bookInclude,
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async updateBook(id: string, body: UpdateBookDto) {
    await this.getBook(id);
    if (body.authorId) {
      await this.ensureAuthorExists(body.authorId);
    }
    if (body.genreIds?.length) {
      await this.ensureGenresExist(body.genreIds);
    }
    return this.prisma.book.update({
      where: { id },
      data: body,
      include: bookInclude,
    });
  }

  async deleteBook(id: string) {
    await this.getBook(id);
    return this.prisma.book.delete({ where: { id } });
  }

  async uploadCover(id: string, file: Express.Multer.File) {
    await this.getBook(id);
    const url = await this.cloudinary.uploadBuffer(file.buffer, 'books/covers');
    return this.prisma.book.update({
      where: { id },
      data: { cover: url },
      include: bookInclude,
    });
  }

  private async ensureAuthorExists(authorId: string) {
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
    });
    if (!author) {
      throw new BadRequestException('Author not found');
    }
  }

  private async ensureGenresExist(genreIds: string[]) {
    const genres = await this.prisma.genre.findMany({
      where: { id: { in: genreIds } },
    });
    if (genres.length !== genreIds.length) {
      throw new BadRequestException('One or more genres not found');
    }
  }
}
