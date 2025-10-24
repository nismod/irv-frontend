import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { AppLink } from '@/lib/nav';

import { RegionSearchNavigation } from '@/modules/metrics/components/region-search/RegionSearchNavigation';

import { countriesUrl } from '../data/gdl-urls';
import { CountryOption } from '../types/CountryOption';

export const Component = () => {
  const { pathname } = useLocation();
  const [allCountriesMeta, setAllCountriesMeta] = useState<CountryOption[]>([
    { code: 'afg', label: 'Afghanistan' },
  ]);

  useEffect(() => {
    fetch(countriesUrl)
      .then((d) => d.json())
      .then((d) => d.map((row) => ({ code: row.iso_code, label: row.country_name })))
      .then((d) => setAllCountriesMeta(d));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="column" gap={2} paddingBottom={100} mt={5} width={'100%'}>
        <AppLink to="/metrics/regions/afg">&larr; Back</AppLink>
        <Typography variant="h2">All countries</Typography>
        <Stack mt={3} spacing={2}>
          <Box>
            <Typography variant="h3">Search</Typography>
            <Box my={1}>
              <RegionSearchNavigation
                regions={allCountriesMeta}
                title="Select a country"
                metricId="development"
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="h3">Browse</Typography>
            <List>
              {allCountriesMeta.map((region) => (
                <li key={region.code}>
                  <ListItemButton
                    component={RouterLink}
                    to={region.code}
                    state={{ from: pathname }}
                  >
                    <ListItemText primary={region.label} />
                  </ListItemButton>
                </li>
              ))}
            </List>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

Component.displayName = 'RegionMetricsIndexPage';
