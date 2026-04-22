'use client';

import type { Book } from '@/types/book';
import { BookCard } from './BookCard';
import Grid from '@mui/material/Grid';
import { BookService } from '@/api/bookService';
import { useSession } from 'next-auth/react';

interface BookListProps {
  books: Book[];
}

const bookService = new BookService();

export const BookList = ({ books }: BookListProps) => {
  const { data: session, update } = useSession();
  const user = session?.user;

  const toggleRead = async (id: string, isRead: boolean) => {
    try {
      await bookService.readBook(id, { isRead: !isRead });
      await update();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await bookService.favoriteBook(id, {
        isFavorite: !isFavorite,
      });
      await update();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid
      container
      spacing={5}
      justifyContent={{
        xs: 'center',
        sm: 'start',
      }}
    >
      {books.map((book) => (
        <Grid
          size={{ xs: 10, sm: 6, md: 5, lg: 4, xl: 3, xxl: 2 }}
          key={book.id}
          justifyItems="center"
        >
          <BookCard
            book={book}
            favoriteBooks={user?.favoriteBooks || []}
            readBooks={user?.readBooks || []}
            toggleRead={toggleRead}
            toggleFavorite={toggleFavorite}
          />
        </Grid>
      ))}
    </Grid>
  );
};
