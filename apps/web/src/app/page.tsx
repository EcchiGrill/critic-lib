'use client';

import { Header } from '@/components/Header';
import { headerHeight } from '@/constants/headerHeight';
import { BookList } from '@/components/BookList';
import Container from '@mui/material/Container';
import { useState, useEffect } from 'react';
import { Loader } from '@/components/ui/Loader';
import { Book } from '@/types/book';
import { BookService } from '@/api/bookService';
import Box from '@mui/material/Box';

const bookService = new BookService();

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <>
      <Header currentPage="Home" />
      {isLoading ? (
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `calc(100vh - ${headerHeight})`,
          }}
        >
          <Loader size={90} />
        </Container>
      ) : (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 6 }}>
          <BookList books={books} />
        </Box>
      )}
    </>
  );
}
