import z from 'zod';

export const reviewSchema = z.object({
  rating: z.number(),
  comment: z.string().optional(),
});

export type ReviewData = z.infer<typeof reviewSchema>;
