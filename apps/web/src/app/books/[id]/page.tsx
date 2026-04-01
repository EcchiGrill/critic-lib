import { BookService } from '@/api/bookService';
import { BookPage } from '@/components/BookPage';
import { Header } from '@/components/Header';
import { notFound } from 'next/navigation';

interface BookPageProps {
  params: Promise<{ id: string }>;
}

const bookService = new BookService();

export default async function Page({ params }: BookPageProps) {
  const { id } = await params;
  const book = await bookService.getBook(id);

  if (!book) return notFound();

  return (
    <>
      <Header currentPage={book.title} />
      <BookPage {...book} />
    </>
  );
}
