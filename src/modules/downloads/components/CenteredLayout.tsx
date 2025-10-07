import Container from '@mui/material/Container';

export const CenteredLayout = ({ children }) => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {children}
    </Container>
  );
};
