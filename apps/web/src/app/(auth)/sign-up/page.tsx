'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContainer } from '@/components/AuthContainer';
import { SignUpData, signUpSchema } from '@/schema/sign-up.schema';
import { useRouter } from 'next/navigation';
import signUpImage from '../../../../public/sign-up.jpg';
import { useTheme } from '@mui/material/styles';
import { AuthService } from '@/api/authService';
import { Link } from '@/components/ui/Link';
import { LabeledTextfield } from '@/components/ui/LabeledTextField';
import { ContainedButton } from '@/components/ui/Button';

const authService = new AuthService();

export default function SignUp() {
  const router = useRouter();

  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: SignUpData) => {
    const { username, email, password } = data;

    try {
      await authService.register(username, email, password);
      router.push('/sign-in');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AuthContainer
        title="Create an account"
        description="Join CriticLib to track books, write reviews, and discover your next read."
        footer={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              component={'p'}
              color="textSecondary"
            >
              Already have an account?
            </Typography>
            <Link href="/sign-in" active>
              Sign in
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
            id="username"
            label="Username"
            required
            placeholder="Hayman Andrews"
            {...register('username')}
            errorMessage={errors.username?.message}
          />

          <LabeledTextfield
            id="email"
            label="Email"
            required
            placeholder="example@mail.com"
            {...register('email')}
            errorMessage={errors.email?.message}
          />

          <LabeledTextfield
            id="password"
            label="Password"
            required
            type="password"
            placeholder="at least 8 characters"
            {...register('password')}
            errorMessage={errors.password?.message}
          />

          <LabeledTextfield
            id="confirmPassword"
            label="Confirm password"
            required
            type="password"
            placeholder="at least 8 characters"
            {...register('confirmPassword')}
            errorMessage={errors.confirmPassword?.message}
          />

          <ContainedButton
            loading={isSubmitting}
            type="submit"
            size="large"
            sx={{ width: '100%', mt: 2 }}
          >
            Sign up
          </ContainedButton>
        </Box>
      </AuthContainer>

      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          [theme.breakpoints.down('lg')]: {
            display: { xs: 'none', lg: 'block' },
          },
        }}
      >
        <Image src={signUpImage} alt="sign up" fill sizes="50vw" />
      </Box>
    </>
  );
}
