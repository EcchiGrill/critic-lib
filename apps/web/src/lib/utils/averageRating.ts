import { Review } from '@/types/review';

export const averageRating = (reviews: Review[]) => {
  if (!reviews.length) return null;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
};
