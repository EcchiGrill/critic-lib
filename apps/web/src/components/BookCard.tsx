'use client';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import BookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { Book } from '@/types/book';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { averageRating } from '@/lib/utils/averageRating';
import { IconButton } from './ui/IconButton';

interface BookCardProps {
  book: Book;
  favoriteBooks: string[];
  readBooks: string[];
  toggleRead: (id: string, isRead: boolean) => void;
  toggleFavorite: (id: string, isFavorite: boolean) => void;
}

export const BookCard = ({
  book,
  favoriteBooks,
  readBooks,
  toggleRead,
  toggleFavorite,
}: BookCardProps) => {
  const { id, title, author, cover, genres, reviews } = book;

  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const avgRating = averageRating(reviews);

  const isFavorite = favoriteBooks.some((bookId) => bookId === id);
  const isRead = readBooks.some((bookId) => bookId === id);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxWidth: '350px',
      }}
    >
      <CardActionArea
        disableRipple
        disableTouchRipple
        onClick={() => router.push(`/books/${id}`)}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {cover ? (
          <CardMedia
            component="img"
            height={280}
            alt={title}
            image={cover}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 280,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookIcon fontSize="large" sx={{ color: 'text.disabled' }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, pb: '15px !important' }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {author.name}
          </Typography>

          {avgRating !== null && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
            >
              <Rating value={avgRating} precision={0.5} size="small" readOnly />
              <Typography variant="caption" color="text.secondary">
                ({reviews.length})
              </Typography>
            </Box>
          )}

          {genres.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {genres.slice(0, 2).map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </CardContent>
      </CardActionArea>

      {user && (
        <CardActions
          sx={{ px: 1.5, pt: 0, pb: 1, justifyContent: 'flex-end', gap: 0.5 }}
        >
          <Tooltip title={isRead ? 'Mark as unread' : 'Mark as read'}>
            <IconButton
              size="small"
              onClick={() => toggleRead(id, isRead)}
              aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
              color={isRead ? 'success' : 'default'}
            >
              {isRead ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <CheckCircleOutlineIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <IconButton
              size="small"
              onClick={() => toggleFavorite(id, isFavorite)}
              aria-label={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
              color={isFavorite ? 'error' : 'default'}
            >
              {isFavorite ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};
