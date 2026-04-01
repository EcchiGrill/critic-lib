'use client';

import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import { FC } from 'react';

interface LinkProps extends TypographyProps {
  active?: boolean;
  href?: string;
}

export const StyledTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<Omit<LinkProps, 'href'>>(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  textDecoration: 'none',
  transition: 'all 0.2s ease-in-out',
  fontFamily: 'Work Sans',

  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const Link: FC<LinkProps> = ({ href = '/', ...props }) => {
  return (
    <NextLink style={{ textDecoration: 'none' }} href={href}>
      <StyledTypography variant="subtitle2" as="span" {...props} />
    </NextLink>
  );
};
