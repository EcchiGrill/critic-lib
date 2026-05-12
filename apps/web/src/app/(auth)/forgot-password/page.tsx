'use client';

import { useState } from 'react';
import { LabeledTextfield } from '@/components/ui/LabeledTextField';
import { Link } from '@/components/ui/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AuthContainer } from '@/components/AuthContainer';
import {
  ForgotPasswordData,
  forgotPasswordSchema,
} from '@/schema/forgot-password.schema';
import { useRouter } from 'next/navigation';
import recoveryImage from '../../../../public/recovery.jpg';
import { AuthService } from '@/api/authService';
import { ContainedButton } from '@/components/ui/Button';
const authService = new AuthService();

export default function ForgotPassword() {
  const router = useRouter();

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    await authService.forgotPassword(data.email).then(() => {
      setIsSuccess(true);
      setTimeout(() => {
        router.replace('/sign-in');
      }, 2000);
    });
  };

  return (
    <>
      <AuthContainer
        title="Forgot password?"
        description="Don’t worry, we’ll send you reset instructions."
        footer={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle2"
              component={'p'}
              color="textSecondary"
            >
              Back to
            </Typography>
            <Link href="/sign-in" active>
              Log in
            </Link>
          </Box>
        }
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap={3}
          width="100%"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box>
            <LabeledTextfield
              id="Email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              {...register('email')}
              errorMessage={errors.email?.message}
            />

            {isSuccess && (
              <Typography
                variant="subtitle2"
                color="success"
                data-testid="reset-success-message"
                component={'p'}
              >
                A reset link has been sent to your email. Redirecting to
                login...
              </Typography>
            )}
          </Box>

          <ContainedButton
            loading={isSubmitting || isSuccess}
            type="submit"
            size="large"
            sx={{ width: '100%' }}
          >
            Forgot password
          </ContainedButton>
        </Box>
      </AuthContainer>

      <Box
        sx={{
          height: '100vh',
          position: 'relative',
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <Image src={recoveryImage} alt="forgot password" fill sizes="50vw" />
      </Box>
    </>
  );
}
