import type { Author } from './author';
import type { Genre } from './genre';
import type { Review } from './review';

export interface Book {
  id: string;
  title: string;
  author: Author;
  authorId: string;
  description: string | null;
  pages: number;
  cover: string | null;
  genres: Genre[];
  reviews: Review[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
