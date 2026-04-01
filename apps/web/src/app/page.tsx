import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Header } from '@/components/Header';
import { headerHeight } from '@/constants/headerHeight';

export default async function Home() {
  return (
    <>
      <Header currentPage="Home" />
      <Stack
        component="main"
        flex={1}
        alignItems="center"
        justifyContent="center"
        sx={{
          height: `calc(100vh - ${headerHeight})`,
          p: '20px 35px',
          gap: 2,
        }}
      >
        <Typography variant="h2" component="h1">
          Your reading life, organized
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 520 }}
        >
          Track books you love, log what you have read, and share reviews with
          the community.
        </Typography>
      </Stack>
    </>
  );
}
