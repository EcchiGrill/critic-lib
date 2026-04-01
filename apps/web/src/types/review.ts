import { Book } from './book';
import { User } from './user';

export interface Review {
  id: string;
  bookId: string;
  book: Book;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}
