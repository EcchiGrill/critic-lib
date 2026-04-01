'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PagesIcon from '@mui/icons-material/Pages';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  ContainedButton,
  OutlinedButton,
  TextButton,
} from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/formatDate';
import { extractInitials } from '@/lib/utils/extractInitials';
import { averageRating } from '@/lib/utils/averageRating';
import { useSession } from 'next-auth/react';
import { Book } from '@/types/book';
import { useRouter } from 'next/navigation';
import { BookService } from '@/api/bookService';
import TextField from '@mui/material/TextField';
import { ReviewService } from '@/api/reviewService';
import { ReviewData, reviewSchema } from '@/schema/review.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

const bookService = new BookService();
const reviewService = new ReviewService();

export const BookPage = ({
  id,
  title,
  author,
  cover,
  genres,
  reviews,
  publishedAt,
  pages,
  description,
}: Book) => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const user = session?.user;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<ReviewData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  const reviewRating = useWatch({ control, name: 'rating' });

  const avgRating = averageRating(reviews);
  const isFavorite = user?.favoriteBooks.some((bookId) => bookId === id);
  const isRead = user?.readBooks.some((bookId) => bookId === id);

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

  const onReviewSubmit = async (data: ReviewData) => {
    const { rating, comment } = data;

    try {
      await reviewService.createReview({
        bookId: id,
        rating,
        comment,
      });
      await update();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <TextButton
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 3 }}
        color="inherit"
      >
        Back
      </TextButton>

      <Box
        sx={{
          display: 'flex',
          gap: { xs: 3, md: 5 },
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 5,
        }}
      >
        <Box sx={{ flexShrink: 0, mx: { xs: 'auto', sm: 0 } }}>
          {cover ? (
            <Box
              component="img"
              src={cover}
              alt={title}
              sx={{
                width: 250,
                borderRadius: 2,
                boxShadow: 4,
                display: 'block',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: { xs: 160, sm: 200 },
                height: { xs: 220, sm: 280 },
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 4,
              }}
            >
              <MenuBookIcon sx={{ fontSize: 72, color: 'text.disabled' }} />
            </Box>
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" gutterBottom sx={{ lineHeight: 1.25 }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="subtitle1" color="text.secondary">
              {author.name}
            </Typography>
          </Box>
          {avgRating !== null ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={avgRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                {avgRating.toFixed(1)} / 5 &bull; {reviews.length} review
                {reviews.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No reviews yet
            </Typography>
          )}
          {genres.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {genres.map((g) => (
                <Chip
                  key={g.id}
                  label={g.name}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <Tooltip title="Pages">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PagesIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {pages} pages
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Published">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(publishedAt)}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
          {user && (
            <Stack direction="row" spacing={1.5}>
              {isRead ? (
                <ContainedButton
                  color="secondary"
                  startIcon={<CheckCircleIcon fontSize="small" />}
                  onClick={() => toggleRead(id, isRead)}
                >
                  Read
                </ContainedButton>
              ) : (
                <OutlinedButton
                  color="inherit"
                  startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                  onClick={() => toggleRead(id, isRead!)}
                >
                  Mark as Read
                </OutlinedButton>
              )}
              {isFavorite ? (
                <ContainedButton
                  color="error"
                  startIcon={<FavoriteIcon fontSize="small" />}
                  onClick={() => toggleFavorite(id, isFavorite)}
                >
                  Favorited
                </ContainedButton>
              ) : (
                <OutlinedButton
                  color="inherit"
                  startIcon={<FavoriteBorderIcon fontSize="small" />}
                  onClick={() => toggleFavorite(id, isFavorite!)}
                >
                  Favorite
                </OutlinedButton>
              )}
            </Stack>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {description && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom>
            About this book
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.8 }}
          >
            {description}
          </Typography>
        </Box>
      )}

      {author.bio && (
        <Paper variant="outlined" sx={{ p: 3, mb: 5, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            About the Author
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
                flexShrink: 0,
              }}
            >
              {extractInitials(author.name)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">{author.name}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, lineHeight: 1.7 }}
              >
                {author.bio}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Reviews{reviews.length > 0 ? ` (${reviews.length})` : ''}
        </Typography>

        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No reviews yet. Be the first to review this book!
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.map((review) => (
              <Paper
                key={review.id}
                variant="outlined"
                sx={{ p: 3, borderRadius: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    src={review.user.avatar ?? ''}
                    sx={{
                      bgcolor: 'secondary.main',
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                    }}
                  >
                    {extractInitials(review.user.username)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {review.user.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                    <Rating
                      value={review.rating}
                      size="small"
                      readOnly
                      sx={{ mb: 1 }}
                    />
                    {review.comment && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        {review.comment}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
      {user && (
        <Paper
          variant="outlined"
          component="form"
          onSubmit={handleSubmit(onReviewSubmit)}
          sx={{
            mt: 5,
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Leave a review
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.7 }}
          >
            Share your impression of this book.
          </Typography>

          <Stack spacing={2.5}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Your rating
              </Typography>
              <Rating
                value={reviewRating}
                onChange={(_, value) => setValue('rating', value ?? 1)}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              label="Your review"
              placeholder="What did you like or dislike about this book?"
              {...register('comment')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ContainedButton type="submit" disabled={isSubmitting}>
                Submit review
              </ContainedButton>
            </Box>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};
