'use client';

import MUICheckbox, { CheckboxProps } from '@mui/material/Checkbox';

export const Checkbox = (props: CheckboxProps) => {
  return (
    <MUICheckbox
      disableRipple
      disableFocusRipple
      disableTouchRipple
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: 16,
        },
        padding: 0,
        borderRadius: 2,
      }}
      {...props}
    />
  );
};
