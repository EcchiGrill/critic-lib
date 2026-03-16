'use client';

import { ButtonPropsWithoutVariant } from './types';
import { styled } from '@mui/material/styles';
import { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { BaseButton } from './BaseButton';

export const StyledOutlinedButton = styled(BaseButton)<MUIButtonProps>(
  ({ size = 'medium', color = 'primary', theme }) => ({
    ...(color === 'primary' && {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    }),

    ...(size === 'small' && {
      padding: '3px 9px',
    }),
    ...(size === 'medium' && {
      padding: '5px 15px',
    }),
    ...(size === 'large' && {
      padding: '7px 21px',
    }),

    '&:hover': {
      backgroundColor: 'transparent',
    },
  })
);

export const OutlinedButton = (props: ButtonPropsWithoutVariant) => {
  return <StyledOutlinedButton variant="outlined" {...props} />;
};
