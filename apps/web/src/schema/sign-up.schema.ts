import * as z from 'zod';

export const signUpSchema = z
  .object({
    username: z.string().min(3, 'Username is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpData = z.infer<typeof signUpSchema>;
