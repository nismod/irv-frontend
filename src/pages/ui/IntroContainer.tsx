import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

export const IntroContainer: FC = ({ children }) => {
  return (
    <Stack
      paddingY={10}
      paddingX={5}
      justifyContent="center"
      alignItems="center"
      sx={{
        // backgroundColor: '#EAEAE4',
        // backgroundColor: 'rgba(234,234,228, 0.3)',

        backgroundColor: 'rgba(50,50,50, 0.02)',
        // backgroundColor: `rgb(23,38,23)`,
        // backgroundColor: 'white',
        boxShadow: `inset 0em 0em 1.5em 1.5em rgba(0, 0, 0, 0.02)`,
      }}
    >
      <Stack maxWidth={750} gap={3}>
        {children}
      </Stack>
    </Stack>
  );
};

export const IntroTypography: FC = ({ children }) => {
  return (
    <Typography sx={{ fontWeight: 500, fontSize: '1.3rem' }} paragraph={true}>
      {children}
    </Typography>
  );
};
