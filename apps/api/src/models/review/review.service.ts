import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

const reviewInclude = {
  book: {
    include: {
      author: true,
      genres: true,
    },
  },
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
} satisfies Prisma.ReviewInclude;

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(body: CreateReviewDto, jwtUserId: string) {
    await this.ensureBookExists(body.bookId);
    return this.prisma.review.create({
      data: {
        ...body,
        userId: jwtUserId,
      },
      include: reviewInclude,
    });
  }

  private async ensureBookExists(bookId: string) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
  }
}
