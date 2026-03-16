import { BreakpointsOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true;
  }
}

export const defaultBreakpoints: BreakpointsOptions = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 2000,
  },
};
