import { Stack, Typography } from '@mui/material';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { ArticleContainer, ArticleContentContainer } from '@/pages/ui/ArticleContainer';
import { HeadingBox, HeadingBoxText } from '@/pages/ui/HeadingBox';

import { CenteredLayout } from '../components/CenteredLayout';
import { fetchAllRegions } from '../data/regions';
import { mdxComponents } from '../markdown';
import DownloadsIntroText from '../sections/DownloadsIntroText.mdx';
import { RegionSearchNavigation } from '../sections/RegionSearchNavigation';

export const loader = async ({ request: { signal } }: LoaderFunctionArgs) => ({
  regions: await fetchAllRegions({}, signal),
});

loader.displayName = 'landingPageLoader';

export type LandingPageData = LoaderData<typeof loader>;

export const Component = () => {
  const { regions } = useLoaderData() as LandingPageData;

  return (
    <>
      <HeadingBox>
        <HeadingBoxText>Data Extract Downloads</HeadingBoxText>
      </HeadingBox>
      <CenteredLayout>
        <ArticleContainer>
          <ArticleContentContainer>
            <DownloadsIntroText components={mdxComponents} />
          </ArticleContentContainer>
        </ArticleContainer>
        <Stack direction="column" alignItems={'center'}>
          <RegionSearchNavigation regions={regions} title="Select a country" />
          <Typography textAlign="center" sx={{ my: 2 }}>
            Or <AppLink to="regions">browse all countries</AppLink>
          </Typography>
        </Stack>
      </CenteredLayout>
    </>
  );
};

Component.displayName = 'LandingPage';
