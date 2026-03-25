import { User } from './user';

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}
