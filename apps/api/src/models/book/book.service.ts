import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Prisma } from '@prisma/client';
import type { Express } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FavoriteBookDto } from './dto/favorite-book.dto';
import { ReadBookDto } from './dto/read-book.dto';

const BOOKS_CACHE_KEY = 'books:all';
const BOOKS_CACHE_TTL = 60000;

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
    private readonly cloudinary: CloudinaryService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  private async invalidateBooksCache() {
    await this.cacheManager.del(BOOKS_CACHE_KEY);
  }

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
    await this.invalidateBooksCache();
    return book;
  }

  async getBooks() {
    const cached = await this.cacheManager.get(BOOKS_CACHE_KEY);
    if (cached) {
      return cached;
    }

    const books = await this.prisma.book.findMany({
      include: bookInclude,
    });

    await this.cacheManager.set(BOOKS_CACHE_KEY, books, BOOKS_CACHE_TTL);
    return books;
  }

  async getFavoriteBooks(userId: string) {
    return this.prisma.book.findMany({
      where: { usersFavorite: { some: { id: userId } } },
      include: bookInclude,
    });
  }

  async getReadBooks(userId: string) {
    return this.prisma.book.findMany({
      where: { usersRead: { some: { id: userId } } },
      include: bookInclude,
    });
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
    const book = await this.prisma.book.update({
      where: { id },
      data: body,
      include: bookInclude,
    });
    await this.invalidateBooksCache();
    return book;
  }

  async deleteBook(id: string) {
    await this.getBook(id);
    const book = await this.prisma.book.delete({ where: { id } });
    await this.invalidateBooksCache();
    return book;
  }

  async uploadCover(id: string, file: Express.Multer.File) {
    await this.getBook(id);
    const url = await this.cloudinary.uploadBuffer(file.buffer, 'books/covers');
    const book = await this.prisma.book.update({
      where: { id },
      data: { cover: url },
      include: bookInclude,
    });
    await this.invalidateBooksCache();
    return book;
  }

  async favoriteBook(id: string, userId: string, body: FavoriteBookDto) {
    const { isFavorite } = body;

    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { usersFavorite: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.prisma.book.update({
      where: { id },
      data: {
        usersFavorite: isFavorite
          ? { connect: { id: userId } }
          : { disconnect: { id: userId } },
      },
    });
  }

  async readBook(id: string, userId: string, body: ReadBookDto) {
    const { isRead } = body;

    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { usersRead: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.prisma.book.update({
      where: { id },
      data: {
        usersRead: isRead
          ? { connect: { id: userId } }
          : { disconnect: { id: userId } },
      },
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
