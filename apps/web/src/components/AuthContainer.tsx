'use client';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';
import Box from '@mui/material/Box';

interface AuthContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const StyledContainer = styled(Box)(({ theme }) => ({
  margin: '20% auto',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '48px',
  width: '100%',
  padding: '0',

  [theme.breakpoints.down('sm')]: {
    padding: '0 24px',
  },
}));

const StyledContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '400px',
});

export const AuthContainer: FC<AuthContainerProps> = ({
  title,
  description,
  children,
  footer,
}) => (
  <StyledContainer>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" component={'h1'}>
        {title}
      </Typography>
      {description && (
        <Typography variant="subtitle2" component="p" color="textSecondary">
          {description}
        </Typography>
      )}
    </Box>
    <StyledContent>
      {children}
      {footer}
    </StyledContent>
  </StyledContainer>
);
