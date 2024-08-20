import { Stack, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Stack
      sx={{
        backgroundColor: 'black',
        backgroundImage: `linear-gradient(to left, rgba(50,50,50, 0.5), rgba(50,50,50, 0.6))`,
        height: '15rem',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography color={'white'}>TODO footer</Typography>
    </Stack>
  );
};
