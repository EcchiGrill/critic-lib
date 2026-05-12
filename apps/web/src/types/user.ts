export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isEmailConfirmed: boolean;
  avatar: string | null;
  favoriteBooks: string[];
  readBooks: string[];
  reviews: string[];
  createdAt: string;
  updatedAt: string;
}
