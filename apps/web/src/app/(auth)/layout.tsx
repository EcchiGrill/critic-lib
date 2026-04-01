import Box from '@mui/material/Box';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import logo from '../../../public/logo.png';
import { authOptions } from '@/constants/authConfig';
import { Link } from '@/components/ui/Link';

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <>
      <Box sx={{ position: 'absolute', top: '22px', left: '24px', zIndex: 1 }}>
        <Link href="/">
          <Image src={logo} alt="logo" width={30} height={25} />
        </Link>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
    </>
  );
}
