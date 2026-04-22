'use client';

import { LabeledTextfield } from '@/components/ui/LabeledTextField';
import { Link } from '@/components/ui/Link';
import Box from '@mui/material/Box';
import { AuthService } from '@/api/authService';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthContainer } from '@/components/AuthContainer';
import {
  ResetPasswordData,
  resetPasswordSchema,
} from '@/schema/reset-password.schema';
import recoveryImage from '../../../../public/recovery.jpg';
import { ContainedButton } from '@/components/ui/Button';
import { useState } from 'react';

const authService = new AuthService();

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    shouldFocusError: true,
  });

  if (!token) {
    router.replace('/');
    return null;
  }

  const onSubmit = async (data: ResetPasswordData) => {
    await authService.resetPassword(token, data.password).then(() => {
      setIsSuccess(true);
      setTimeout(() => {
        router.replace('/sign-in');
      }, 2000);
    });
  };

  return (
    <>
      <AuthContainer
        title="Reset password"
        description="Please create new password here"
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
          <LabeledTextfield
            id="password"
            placeholder="at least 6 characters"
            required
            type="password"
            label="Password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          <Box>
            <LabeledTextfield
              id="Confirm password"
              required
              type="password"
              placeholder="at least 6 characters"
              label="Confirm password"
              {...register('confirmPassword')}
              errorMessage={errors.confirmPassword?.message}
            />

            {isSuccess && (
              <Typography variant="subtitle2" component={'p'} color="success">
                Password reset successful. Redirecting to login...
              </Typography>
            )}
          </Box>
          <ContainedButton
            loading={isSubmitting || isSuccess}
            type="submit"
            size="large"
            sx={{ width: '100%' }}
          >
            Reset Password
          </ContainedButton>
        </Box>
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
