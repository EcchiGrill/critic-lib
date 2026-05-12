import z from 'zod';

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .nullable(),
    confirmPassword: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
