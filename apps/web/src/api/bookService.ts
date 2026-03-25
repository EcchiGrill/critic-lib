import { Book } from '@/types/book';
import { api } from './axiosInstance';

interface CreateBookBody {
  title: string;
  authorId: string;
  description?: string;
  pages: number;
  cover?: string;
  publishedAt: string;
  genreIds?: string[];
}

export class BookService {
  private static instance: BookService;

  constructor() {
    if (BookService.instance) {
      return BookService.instance;
    }
    BookService.instance = this;
  }

  async getBooks(): Promise<Book[]> {
    const { data } = await api.get<Book[]>('/books');
    return data;
  }

  async getBook(id: string): Promise<Book> {
    const { data } = await api.get<Book>(`/books/${id}`);
    return data;
  }

  async createBook(book: CreateBookBody): Promise<Book> {
    const { data } = await api.post<Book>('/books', book);
    return data;
  }

  async updateBook(id: string, book: Partial<CreateBookBody>): Promise<Book> {
    const { data } = await api.patch<Book>(`/books/${id}`, book);
    return data;
  }

  async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  }

  async uploadCover(id: string, file: File): Promise<Book> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<Book>(`/books/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
}
