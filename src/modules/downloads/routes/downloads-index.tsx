import { Stack, Typography } from '@mui/material';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { ArticleContainer, ArticleParagraph } from '@/pages/ui/ArticleContainer';
import { Footer } from '@/pages/ui/Footer';

import { CenteredLayout } from '../components/CenteredLayout';
import { fetchAllRegions } from '../data/regions';
import { RegionSearchNavigation } from '../sections/RegionSearchNavigation';
import { RegionMetricsHeader } from './regions/RegionMetricsHeader';

export const loader = async ({ request: { signal } }: LoaderFunctionArgs) => ({
  regions: await fetchAllRegions({}, signal),
});

loader.displayName = 'landingPageLoader';

export type LandingPageData = LoaderData<typeof loader>;

export const Component = () => {
  const { regions } = useLoaderData() as LandingPageData;

  return (
    <>
      <RegionMetricsHeader />
      <CenteredLayout>
        <Stack direction="column" paddingBottom={25} paddingTop={5} gap={4}>
          <ArticleContainer>
            <Stack direction="column" paddingBottom={10} gap={5}>
              <ArticleParagraph>
                Datasets can be requested individually for each country. They are then prepared for
                download and available for all users through this page.
              </ArticleParagraph>
              <ArticleParagraph>
                Please note that the process of preparing a dataset can take a significant amount of
                time, depending on the size of the country and complexity of the data.
              </ArticleParagraph>
              <ArticleParagraph>
                For programmatic interactions with this service, please also refer to the API
                documentation, Python client and usage examples.
              </ArticleParagraph>
            </Stack>
          </ArticleContainer>
          <Stack direction="column" alignItems={'center'}>
            <RegionSearchNavigation regions={regions} title="Select a country" />
            <Typography textAlign="center" sx={{ my: 2 }}>
              Or <AppLink to="regions">browse all countries</AppLink>
            </Typography>
          </Stack>
        </Stack>
      </CenteredLayout>
      <Footer />
    </>
  );
};

Component.displayName = 'LandingPage';
