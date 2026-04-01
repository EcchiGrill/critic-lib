'use client';

import { Review } from '@/types/review';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { formatDate } from '@/lib/utils/formatDate';
import { useState } from 'react';
import { TextButton } from './ui/Button';

interface RecentReviewsProps {
  reviews: Review[];
}

const initialMaxReviews = 5;

export const RecentReviews = ({ reviews }: RecentReviewsProps) => {
  const [maxReviews, setMaxReviews] = useState(initialMaxReviews);

  const handleShow = () => {
    if (maxReviews === initialMaxReviews) {
      setMaxReviews(reviews.length);
    } else {
      setMaxReviews(initialMaxReviews);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        {reviews.slice(0, maxReviews).map((review) => {
          return (
            <Paper
              key={review.id}
              variant="outlined"
              sx={{ p: 3, borderRadius: 2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    {review.book.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(review.createdAt)}
                  </Typography>
                </Box>
                <Rating value={review.rating} size="small" readOnly />
              </Box>
              {review.comment && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {review.comment}
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
      {reviews.length > initialMaxReviews && (
        <TextButton onClick={handleShow} sx={{ mt: 2 }}>
          {maxReviews === initialMaxReviews ? 'Show more' : 'Show less'}
        </TextButton>
      )}
    </>
  );
};
