import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface EmptyFallbackProps {
  label: string;
}

export const EmptyFallback = ({ label }: EmptyFallbackProps) => {
  return (
    <Box
      sx={{
        py: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        color: 'text.disabled',
      }}
    >
      <MenuBookIcon fontSize="large" />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};
