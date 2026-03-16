'use client';

import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';

export const Loader = ({ sx, ...props }: CircularProgressProps) => {
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <linearGradient
            id="loader-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#F5F7FF" />
            <stop offset="100%" stopColor="#A5B4FC" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{
          '& .MuiCircularProgress-circle': {
            stroke: 'url(#loader-gradient)',
          },
          ...sx,
        }}
        {...props}
      />
    </>
  );
};
