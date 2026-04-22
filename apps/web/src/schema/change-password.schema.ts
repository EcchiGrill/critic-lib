import z from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional().nullable(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
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
  )
  .refine(
    (data) => {
      if (data.password) {
        return !!data.currentPassword;
      }
      return true;
    },
    {
      message: 'Current password is required to set a new password',
      path: ['currentPassword'],
    }
  );

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
