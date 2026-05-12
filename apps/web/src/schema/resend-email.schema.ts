import { z } from 'zod';

export const resendEmailSchema = z.object({
  email: z.string().email(),
});

export type ResendEmailData = z.infer<typeof resendEmailSchema>;
