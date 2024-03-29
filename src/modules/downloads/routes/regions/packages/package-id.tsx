import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { BackLink } from '@/lib/nav';

export const Component = () => {
  const { pvId } = useParams();

  return (
    <Container>
      <BackLink>&larr; Back</BackLink>
      <Typography variant="h2">{pvId}</Typography>
    </Container>
  );
};

Component.displayName = 'RegionPackageRoute';
