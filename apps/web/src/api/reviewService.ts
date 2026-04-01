import type { Review } from '@/types/review';
import { api } from './axiosInstance';

interface CreateReviewBody {
  bookId: string;
  rating: number;
  comment?: string;
}

export class ReviewService {
  private static instance: ReviewService;

  constructor() {
    if (ReviewService.instance) {
      return ReviewService.instance;
    }
    ReviewService.instance = this;
  }

  async getReviews(): Promise<Review[]> {
    const { data } = await api.get<Review[]>('/reviews');
    return data;
  }

  async createReview(body: CreateReviewBody): Promise<Review> {
    const { data } = await api.post<Review>('/reviews', body);
    return data;
  }
}
