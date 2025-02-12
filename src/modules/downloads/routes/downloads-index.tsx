import { Stack, Typography } from '@mui/material';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { AppLink, ExtLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import {
  ArticleContainer,
  ArticleContentContainer,
  ArticleParagraph,
  ArticleSection,
  EmphasisTextContainer,
  EmphasisTextParagraph,
  MiniBar,
} from '@/pages/ui/ArticleContainer';
import { HeadingBox, HeadingBoxText } from '@/pages/ui/HeadingBox';

import { fetchAllRegions } from '../data/regions';
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
      <ArticleContainer>
        <ArticleContentContainer>
          <ArticleSection>
            <EmphasisTextContainer>
              <MiniBar />
              <EmphasisTextParagraph>
                This page provides access to extracts of the datasets presented in the tool. The
                extracts are organised by country and data source.
              </EmphasisTextParagraph>
            </EmphasisTextContainer>
            <ArticleParagraph>
              Datasets are prepared individually for each country for download and available for all
              users through this page.
            </ArticleParagraph>

            <ArticleParagraph>
              Please note that some datasets are currently marked unavailable. If any of these are
              of interest, please{' '}
              <ExtLink href="https://github.com/nismod/irv-datapkg/issues/new">
                raise an issue
              </ExtLink>{' '}
              or contact us.
            </ArticleParagraph>

            <ArticleParagraph>
              Datasets are also available for download and reference for archival purposes from{' '}
              <ExtLink href="https://zenodo.org/communities/ccg/records?q=%22Infrastructure%20Climate%20Resilience%20Assessment%20Data%20Starter%20Kit%22&l=list&p=1&s=10&sort=newest">
                Zenodo
              </ExtLink>
              . There is a full list of available records at{' '}
              <ExtLink href="https://github.com/nismod/irv-datapkg/blob/main/records.csv">
                nismod/irv-datapkg
              </ExtLink>
              .
            </ArticleParagraph>

            <ArticleParagraph>
              For programmatic interactions with this service, please also refer to the{' '}
              <ExtLink href="https://global.infrastructureresilience.org/extract/redoc">
                API documentation
              </ExtLink>
              , <ExtLink href="https://github.com/nismod/irv-autopkg-client">Python client</ExtLink>{' '}
              and <ExtLink href="https://github.com/nismod/irv-autopkg-use">usage examples</ExtLink>
              .
            </ArticleParagraph>
          </ArticleSection>
        </ArticleContentContainer>
      </ArticleContainer>
      <Stack direction="column" alignItems={'center'}>
        <RegionSearchNavigation regions={regions} title="Select a country" />
        <Typography textAlign="center" sx={{ mt: 2, mb: 8 }}>
          Or <AppLink to="regions">browse all countries</AppLink>
        </Typography>
      </Stack>
    </>
  );
};

Component.displayName = 'LandingPage';
