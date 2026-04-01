import Box from '@mui/material/Box';
import { Header } from '@/components/Header';
import { headerHeight } from '@/constants/headerHeight';
import { BookList } from '@/components/BookList';

export default async function Home() {
  return (
    <>
      <Header currentPage="Home" />
      <Box
        component="main"
        flex={1}
        sx={{
          gap: '20px',
          height: `calc(100vh - ${headerHeight})`,
        }}
      >
        <BookList />
      </Box>
    </>
  );
}
