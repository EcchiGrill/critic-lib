'use client';

import type { PropsWithChildren } from 'react';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';
import { defaultPalette } from '../styles/palette';
import { defaultTypography } from '../styles/typography';
import { defaultBreakpoints } from '../styles/breakpoints';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const defaultTheme = createTheme({
    palette: defaultPalette,
    typography: defaultTypography,
    breakpoints: defaultBreakpoints,
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true,
        },
      },
    },
  });

  return <MUIThemeProvider theme={defaultTheme}>{children}</MUIThemeProvider>;
};
