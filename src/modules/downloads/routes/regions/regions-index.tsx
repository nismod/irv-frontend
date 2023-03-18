import { Container, Link } from '@mui/material';
import { LoaderFunctionArgs, Link as RouterLink, useLoaderData } from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { fetchAllRegions } from '../../data/regions';

export const loader = async ({ request: { signal } }: LoaderFunctionArgs) => ({
  regions: await fetchAllRegions({}, signal),
});

loader.displayName = 'allRegionsLoader';

type AllRegionsLoaderData = LoaderData<typeof loader>;

export const Component = () => {
  const { regions } = useLoaderData() as AllRegionsLoaderData;

  return (
    <Container>
      <AppLink to="/downloads">&larr; Back to downloads main page</AppLink>
      <ul>
        {regions.map((reg) => (
          <li key={reg.name}>
            <Link component={RouterLink} to={reg.name} state={{ from: '/downloads/regions' }}>
              {reg.name_long}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
};

Component.displayName = 'AllRegionsRoute';
