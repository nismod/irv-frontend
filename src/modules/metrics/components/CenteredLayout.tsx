import { Container } from '@mui/material';

export const CenteredLayout = ({ children }) => {
  return (
    <Container maxWidth="md" sx={{ paddingTop: 2 }}>
      {children}
    </Container>
  );
};
