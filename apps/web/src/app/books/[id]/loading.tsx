import { Loader } from '@/components/ui/Loader';
import { headerHeight } from '@/constants/headerHeight';
import Container from '@mui/material/Container';

export default function Loading() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${headerHeight})`,
      }}
    >
      <Loader size={120} />
    </Container>
  );
}
