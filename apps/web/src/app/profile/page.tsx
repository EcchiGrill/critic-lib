'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import { useEffect, useRef, useState } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { signOut, useSession } from 'next-auth/react';
import { extractInitials } from '@/lib/utils/extractInitials';
import { formatDate } from '@/lib/utils/formatDate';
import { BookList } from '@/components/BookList';
import { EmptyFallback } from '@/components/EmptyFallback';
import { ReviewService } from '@/api/reviewService';
import { Book } from '@/types/book';
import { Review } from '@/types/review';
import { BookService } from '@/api/bookService';
import { RecentReviews } from '@/components/RecentReviews';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { ContainedButton } from '@/components/ui/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { AuthService } from '@/api/authService';
import { IconButton } from '@/components/ui/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import SettingsIcon from '@mui/icons-material/Settings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordSchema,
  type ChangePasswordData,
} from '@/schema/change-password.schema';
import Alert from '@mui/material/Alert';

const authService = new AuthService();
const reviewService = new ReviewService();
const bookService = new BookService();

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 3,
  right: -1,
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  cursor: 'pointer',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px solid ${theme.palette.common.white}`,

  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },

  '& svg': {
    width: '16px',
    height: '16px',
  },
}));

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const user = session?.user;

  const [username, setUsername] = useState(user?.username ?? '');
  const [tab, setTab] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const uploadAvatarRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await authService.uploadAvatar(file);
      await update();
    }
  };

  const handleEditUsername = async () => {
    if (username.trim().length < 3 || username === user?.username) {
      setUsername(user?.username ?? '');
      return;
    }

    try {
      await authService.updateProfile({ username });
      await update();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitPasswordChange = async (data: ChangePasswordData) => {
    await authService
      .updateProfile({
        password: data.password!,
      })
      .then(() => {
        setIsSuccess(true);
        reset();
      });
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      return router.replace('/sign-in');
    }

    if (status === 'loading') return;

    const getProfile = async () => {
      try {
        const reviews = await reviewService.getReviews();
        const readBooks = await bookService.getReadBooks();
        const favoriteBooks = await bookService.getFavoriteBooks();

        setFavoriteBooks(favoriteBooks);
        setReadBooks(readBooks);
        setReviews(reviews);
      } catch (error) {
        console.error(error);
      }
    };

    getProfile();
  }, [status, router]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  return (
    user && (
      <>
        <Header currentPage="Profile" />
        <Box sx={{ mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              borderRadius: 3,
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'space-between' },
              flexWrap: 'wrap',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              gap={4}
              alignItems="center"
            >
              <Box sx={{ position: 'relative' }}>
                <input
                  ref={uploadAvatarRef}
                  style={{ display: 'none' }}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
                <Avatar
                  src={user.avatar ?? ''}
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    flexShrink: 0,
                  }}
                >
                  {extractInitials(user.username)}
                </Avatar>
                <StyledIconButton
                  onClick={() => uploadAvatarRef.current?.click()}
                >
                  <EditIcon />
                </StyledIconButton>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Stack direction="column" gap={1} alignItems="flex-start">
                  <TextField
                    variant="standard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={handleEditUsername}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {user.email}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.disabled">
                  Member since {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Stack>

            <Stack
              gap={3}
              sx={{
                alignItems: 'flex-end',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={<FavoriteIcon />}
                  label={`${user.favoriteBooks.length} Favorite${
                    user.favoriteBooks.length !== 1 ? 's' : ''
                  }`}
                  sx={{ p: 1 }}
                  color="error"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<BookmarkIcon />}
                  label={`${user.readBooks.length} Read`}
                  sx={{ p: 1 }}
                  color="success"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<RateReviewIcon />}
                  label={`${user.reviews.length} Review${
                    user.reviews.length !== 1 ? 's' : ''
                  }`}
                  sx={{ p: 1 }}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <ContainedButton
                color="error"
                onClick={() => signOut({ callbackUrl: '/' })}
                sx={{ width: 150 }}
              >
                Sign out
              </ContainedButton>
            </Stack>
          </Paper>

          <Divider sx={{ mb: 0 }} />

          <Tabs
            value={tab}
            onChange={(_e, v) => setTab(v)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label="Favorites"
              icon={<FavoriteIcon fontSize="small" />}
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: 'none' }}
            />
            <Tab
              label="Read List"
              icon={<BookmarkIcon fontSize="small" />}
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: 'none' }}
            />
            <Tab
              label="Reviews"
              icon={<RateReviewIcon fontSize="small" />}
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: 'none' }}
            />
            <Tab
              label="Settings"
              icon={<SettingsIcon fontSize="small" />}
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: 'none' }}
            />
          </Tabs>

          <Box role="tabpanel" hidden={tab !== 0} sx={{ pt: 3 }}>
            {user.favoriteBooks.length === 0 ? (
              <EmptyFallback label="No favorite books yet. Start adding some!" />
            ) : (
              <BookList books={favoriteBooks} />
            )}
          </Box>

          <Box role="tabpanel" hidden={tab !== 1} sx={{ pt: 3 }}>
            {user.readBooks.length === 0 ? (
              <EmptyFallback label="No books read yet." />
            ) : (
              <BookList books={readBooks} />
            )}
          </Box>

          <Box role="tabpanel" hidden={tab !== 2} sx={{ pt: 3 }}>
            {reviews.length === 0 ? (
              <EmptyFallback label="No reviews written yet." />
            ) : (
              <RecentReviews reviews={reviews} />
            )}
          </Box>

          <Box role="tabpanel" hidden={tab !== 3} sx={{ pt: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                maxWidth: 600,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Update your password to keep your account secure
              </Typography>

              {isSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Password changed successfully!
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmitPasswordChange)}
                noValidate
              >
                <Stack spacing={3}>
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />

                  <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />

                  <ContainedButton
                    type="submit"
                    loading={isSubmitting}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Update Password
                  </ContainedButton>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Box>
      </>
    )
  );
}
