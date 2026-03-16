'use client';

import { BaseButton } from './BaseButton';
import { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { ButtonPropsWithoutVariant } from './types';
import { styled } from '@mui/material/styles';

const StyledTextButton = styled(BaseButton)<MUIButtonProps>(
  ({ size = 'medium', theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary,

    ...(size === 'small' && {
      padding: '4px 5px',
    }),
    ...(size === 'medium' && {
      padding: '6px 8px',
    }),
    ...(size === 'large' && {
      padding: '8px 11px',
    }),
  })
);

export const TextButton = (props: ButtonPropsWithoutVariant) => {
  return <StyledTextButton variant="text" {...props} />;
};
