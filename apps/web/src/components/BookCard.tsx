'use client';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import type { Book } from '@/types/book';
import { useRouter } from 'next/navigation';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const router = useRouter();
  const { id, title, author, cover } = book;

  return (
    <Card sx={{ maxWidth: 350, position: 'relative' }}>
      <CardActionArea
        disableRipple
        disableTouchRipple
        onClick={() => router.push(`/books/${id}`)}
      >
        {cover ? (
          <CardMedia
            component="img"
            height={240}
            alt={title}
            image={cover}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <CardMedia
            component="div"
            sx={{
              height: 240,
              bgcolor: 'action.hover',
            }}
          />
        )}
        <CardContent>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {author.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
