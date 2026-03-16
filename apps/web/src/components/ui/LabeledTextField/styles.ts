import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { styled, Theme } from '@mui/material/styles';

export const StyledInputLabel = styled(InputLabel)(
  ({ theme }: { theme: Theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    marginBottom: '8px',
    transform: 'none',
    position: 'static',
  })
);

export const StyledInput = styled(Input, {
  shouldForwardProp: (propName) => propName !== 'error',
})<{ error?: boolean }>(({ theme, error }) => ({
  ...theme.typography.body2,
  padding: '12px 16px',
  border: '1px solid',
  borderRadius: '8px',
  color: theme.palette.text.secondary,
  borderColor: error ? theme.palette.error.main : theme.palette.text.secondary,
  fontWeight: 500,
}));

export const StyledFormHelperText = styled(FormHelperText)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  fontWeight: '300',
  minHeight: '24px',
  lineHeight: 1,
  top: '5px',
  position: 'relative',
  left: '-10px',
});
