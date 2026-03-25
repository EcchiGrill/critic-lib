import type { Book } from './book';
import type { Review } from './review';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  favoriteBooks: Book[];
  readBooks: Book[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}
