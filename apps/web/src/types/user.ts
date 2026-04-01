export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  favoriteBooks: string[];
  readBooks: string[];
  reviews: string[];
  createdAt: string;
  updatedAt: string;
}
