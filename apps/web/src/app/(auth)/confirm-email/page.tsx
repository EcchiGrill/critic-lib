'use client';

import Box from '@mui/material/Box';
import { AuthService } from '@/api/authService';
import Typography from '@mui/material/Typography';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthContainer } from '@/components/AuthContainer';
import recoveryImage from '../../../../public/recovery.jpg';
import { ContainedButton } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ResendEmailData,
  resendEmailSchema,
} from '@/schema/resend-email.schema';
import { useForm } from 'react-hook-form';
import { LabeledTextfield } from '@/components/ui/LabeledTextField';

const authService = new AuthService();

export default function ConfirmEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendEmailData>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: '',
    },
    shouldFocusError: true,
  });

  if (!token) {
    router.replace('/');
  }

  const onResendEmail = async (data: ResendEmailData) => {
    try {
      await authService.resendConfirmation(data.email);
      setError(null);
      setSuccessMessage('Email sent successfully. Redirecting to login...');
      setTimeout(() => {
        router.replace('/sign-in');
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleConfirmEmail = async () => {
      try {
        await authService.confirmEmail(token || '');
        setSuccessMessage(
          'Email confirmed successfully. Redirecting to login...'
        );
        setTimeout(() => {
          router.replace('/sign-in');
        }, 2000);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data.message);
        }
      }
    };

    handleConfirmEmail();
  }, [token, router]);

  return (
    <>
      <AuthContainer
        title="Confirm email"
        description={
          <>
            {error && (
              <Typography variant="subtitle1" component={'p'} color="error">
                {error}
              </Typography>
            )}
            {successMessage && (
              <Typography variant="subtitle1" color="success">
                {successMessage}
              </Typography>
            )}
          </>
        }
      >
        {error && (
          <Stack
            component="form"
            onSubmit={handleSubmit(onResendEmail)}
            sx={{ width: '100%' }}
            gap={3}
          >
            <LabeledTextfield
              id="Email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              {...register('email')}
              errorMessage={errors.email?.message}
            />
            <ContainedButton
              loading={isSubmitting}
              type="submit"
              size="large"
              sx={{ width: '100%' }}
            >
              Resend email
            </ContainedButton>
          </Stack>
        )}
      </AuthContainer>

      <Box
        sx={(theme) => ({
          height: '100vh',
          position: 'relative',
          [theme.breakpoints.down('lg')]: {
            display: 'none',
          },
        })}
      >
        <Image src={recoveryImage} alt="reset password" fill sizes="50vw" />
      </Box>
    </>
  );
}
