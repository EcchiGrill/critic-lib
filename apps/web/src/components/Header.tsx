'use client';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { IconButton } from './ui/IconButton';
import { ContainedButton } from './ui/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { headerHeight } from '@/constants/headerHeight';
import { extractInitials } from '@/lib/utils/extractInitials';
import Image from 'next/image';

interface HeaderProps {
  currentPage: string;
}

const StyledContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: '20px 30px',
  height: headerHeight,
}));

export const Header = ({ currentPage }: HeaderProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <StyledContainer>
      <Stack direction="row" alignItems="center" gap="20px">
        <IconButton onClick={() => router.push('/')} sx={{ p: 0 }}>
          <Image src="/logo.png" alt="logo" width={30} height={25} />
        </IconButton>
      </Stack>
      <Typography
        color="primary"
        fontWeight={400}
        textTransform="uppercase"
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {currentPage}
      </Typography>
      <Stack direction="row" alignItems="center" gap="20px">
        <Stack direction="row" alignItems="center" gap="15px">
          {user ? (
            <IconButton onClick={() => router.push('/profile')} sx={{ p: 0 }}>
              <Avatar
                src={user.avatar ?? ''}
                sx={{ width: '28px', height: '28px' }}
              >
                {extractInitials(user.username)}
              </Avatar>
            </IconButton>
          ) : (
            <ContainedButton onClick={() => router.push('/sign-in')}>
              Sign in
            </ContainedButton>
          )}
        </Stack>
      </Stack>
    </StyledContainer>
  );
};
