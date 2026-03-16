'use client';

import { StyledIconButton } from './styles';
import { IconButtonProps as MUIIconButtonProps } from '@mui/material/IconButton';

export const IconButton = (props: MUIIconButtonProps) => {
  return <StyledIconButton {...props} />;
};
