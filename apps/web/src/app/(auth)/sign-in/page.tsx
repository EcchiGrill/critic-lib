'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { SignInData, signInSchema } from '@/schema/sign-in.schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContainer } from '@/components/AuthContainer';
import signInImage from '../../../../public/sign-in.jpg';
import { LabeledTextfield } from '@/components/ui/LabeledTextField';
import { ContainedButton } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import Divider from '@mui/material/Divider';
import GoogleIcon from '@mui/icons-material/Google';
import Stack from '@mui/material/Stack';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: SignInData) => {
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.replace('/');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { redirect: true, callbackUrl: '/' });
  };

  return (
    <>
      <AuthContainer
        title="Welcome back"
        description="Please enter your details to log into your account."
        footer={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle2"
              component={'p'}
              color="textSecondary"
            >
              {"Don't have an account?"}
            </Typography>
            <Link href="/sign-up" active>
              Sign up
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
          width="100%"
          gap={3}
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledTextfield
            id="email"
            label="Email"
            required
            placeholder="example@mail.com"
            {...register('email')}
            errorMessage={errors.email?.message}
          />

          <Stack alignItems="flex-end" gap={1.5}>
            <LabeledTextfield
              id="password"
              label="Password"
              required
              type="password"
              placeholder="at least 8 characters"
              {...register('password')}
              errorMessage={errors.password?.message || error}
            />
            <Link href="/forgot-password" fontSize="14px">
              Forgot password?
            </Link>
          </Stack>

          <Stack>
            <ContainedButton
              loading={isSubmitting}
              type="submit"
              size="large"
              sx={{ width: '100%', mt: 2 }}
            >
              Sign in
            </ContainedButton>

            <Box sx={{ my: 3 }}>
              <Divider>
                <Typography variant="caption" color="textSecondary">
                  OR
                </Typography>
              </Divider>
            </Box>

            <ContainedButton
              loading={isGoogleLoading}
              onClick={handleGoogleAuth}
              startIcon={<GoogleIcon />}
              size="large"
              color="secondary"
              sx={{
                width: '100%',
                border: '1px solid #e0e0e0',
              }}
            >
              Continue with Google
            </ContainedButton>
          </Stack>
        </Box>
      </AuthContainer>

      <Box
        sx={{
          height: '100vh',
          position: 'relative',
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <Image src={signInImage} alt="sign in" fill sizes="50vw" />
      </Box>
    </>
  );
}
