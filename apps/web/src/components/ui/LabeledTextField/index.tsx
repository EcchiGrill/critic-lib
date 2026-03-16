'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { InputProps } from '@mui/material/Input';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { StyledFormHelperText, StyledInput, StyledInputLabel } from './styles';

interface LabeledTextfieldProps extends Omit<InputProps, 'error'> {
  label: string;
  errorMessage?: string;
  reserveErrorSpace?: boolean;
}

export const LabeledTextfield = ({
  label,
  errorMessage = '',
  id,
  required,
  reserveErrorSpace = false,
  ...props
}: LabeledTextfieldProps) => {
  const error = !!errorMessage;
  const shouldReserveSpace = reserveErrorSpace || error;

  return (
    <FormControl fullWidth error={error}>
      <Box>
        <StyledInputLabel htmlFor={id} required={required} shrink>
          {label}
        </StyledInputLabel>
      </Box>
      <StyledInput id={id} error={error} disableUnderline {...props} />
      {shouldReserveSpace && (
        <StyledFormHelperText
          sx={{
            visibility: error ? 'visible' : 'hidden',
          }}
        >
          <WarningAmberIcon fontSize="small" />
          {errorMessage}
        </StyledFormHelperText>
      )}
    </FormControl>
  );
};
