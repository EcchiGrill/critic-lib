'use client';

import type { Book } from '@/types/book';
import { BookCard } from './BookCard';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { BookService } from '@/api/bookService';
import { useSession } from 'next-auth/react';
import { Loader } from './ui/Loader';
import { headerHeight } from '@/constants/headerHeight';

const bookService = new BookService();

export const BookList = () => {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

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

  useEffect(() => {
    const getBooks = async () => {
      setIsLoading(true);

      try {
        const books = await bookService.getBooks();
        setBooks(books);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getBooks();
  }, []);

  return (
    <Grid container spacing={5}>
      {isLoading ? (
        <Grid
          size={{ md: 12 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `calc(100vh - ${headerHeight})`,
          }}
        >
          <Loader size={90} />
        </Grid>
      ) : (
        books.map((book) => (
          <Grid
            size={{ md: 4, lg: 4, xl: 3, xxl: 2 }}
            key={book.id}
            sx={{ p: '20px 35px' }}
          >
            <BookCard
              book={book}
              favoriteBooks={user?.favoriteBooks || []}
              readBooks={user?.readBooks || []}
              toggleRead={toggleRead}
              toggleFavorite={toggleFavorite}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};
