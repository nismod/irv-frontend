import { Divider, Stack } from '@mui/material';

import { AppLinkButton, ExtLink } from '@/lib/nav';

import {
  ArticleContainer,
  ArticleContentContainer,
  ArticleParagraph,
  ArticleSection,
  ArticleSectionHeader,
  EmphasisTextContainer,
  EmphasisTextParagraph,
  MiniBar,
} from './ui/ArticleContainer';
import { Card } from './ui/Card';
import { HeadingBox, HeadingBoxText } from './ui/HeadingBox';

export const IntroPage = () => {
  return (
    <ArticleContainer>
      <HeadingBox>
        <HeadingBoxText>Global Climate-Related Risk Analytics</HeadingBoxText>
      </HeadingBox>

      <div className="home" style={{ height: '16rem' }}></div>

      <ArticleContentContainer>
        <ArticleSection>
          <EmphasisTextContainer>
            <MiniBar />
            <EmphasisTextParagraph>
              The Global Resilience Index (GRI) Risk Viewer is a data and analytics portal covering
              hazards, exposure, vulnerability and risk to infrastructure and people around the
              world.
            </EmphasisTextParagraph>

            <EmphasisTextParagraph>
              This tool aims to support climate adaptation decision-making by identifying spatial
              vulnerabilities and risks under current and future climate scenarios.
            </EmphasisTextParagraph>
          </EmphasisTextContainer>
          <ArticleParagraph>
            The GRI Risk Viewer aims to support governments, communities and investors around the
            world to adapt to climate change by making open data &ndash; related to climate hazards,
            exposure and vulnerabilities &ndash; available for visualisation and download, to build
            shared understanding across different scales.
          </ArticleParagraph>
          <ArticleParagraph>
            This in turn enables the identification of key opportunities as well as social
            vulnerability and needs, providing a starting point for risk analysis. The platform
            supports the high-level screening of the risks to both assets and populations. This may
            help identify solutions and manage risks to society, economy and nature.
          </ArticleParagraph>
          <ArticleParagraph>
            The International Panel on Climate Change (IPCC) defines risk as "the potential for
            adverse consequences for human or ecological systems, recognising the diversity of
            values and objectives associated with such systems" (
            <ExtLink href="https://www.ipcc.ch/report/ar6/wg2/chapter/chapter-16/">
              AR6 report
            </ExtLink>
            ). Climate-related risks result from the intersection of hazards, exposure and
            vulnerability, all of which can be explored in detail.
          </ArticleParagraph>

          <Stack
            direction={{ sm: 'column', md: 'row' }}
            flexWrap="wrap"
            useFlexGap={true}
            justifyContent="center"
            alignItems="top"
            spacing={2}
            sx={{ margin: '32px 0 !important' }}
          >
            <Card
              image="./card-hazard.png"
              title="Hazard"
              href="/view/hazard"
              text="Understand hazard intensity and location"
            />
            <Card
              image="./card-exposure.png"
              href="/view/exposure"
              title="Exposure"
              text="Direct population and asset exposure to a variety of
                environmental hazards"
            />
            <Card
              image="./card-vulnerability.png"
              href="/view/vulnerability"
              title="Vulnerability"
              text="Review vulnerability indices for nature and population"
            />
            <Card
              image="./card-risk.png"
              href="/view/risk"
              title="Risk"
              text="Explore analyses including direct damages to transport and power
                infrastructure."
            />
          </Stack>
          <AppLinkButton
            variant="contained"
            size="large"
            to="/view/hazard"
            sx={{ margin: '32px 0 !important' }}
          >
            Explore the data
          </AppLinkButton>

          <ArticleParagraph>
            The research, analysis and development of this site is led by researchers in the{' '}
            <ExtLink href="https://opsis.eci.ox.ac.uk/">
              Oxford Programme for Sustainable Infrastructure Systems
            </ExtLink>{' '}
            at the University of Oxford.
          </ArticleParagraph>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            flexWrap="wrap"
            divider={<Divider orientation="vertical" flexItem />}
            justifyContent="center"
            alignItems="center"
            spacing={2}
            mb={6}
          >
            <ExtLink href="https://opsis.eci.ox.ac.uk">
              <img
                height="120"
                src="/logo-opsis.png"
                alt="Oxford Programme for Sustainable Infrastructure Systems"
              />
            </ExtLink>
          </Stack>
        </ArticleSection>

        <ArticleSection>
          <ArticleSectionHeader>Photo Credit</ArticleSectionHeader>
          <ArticleParagraph>
            Hurricane Irma, 7 September 2017. Data: MODIS/Terra (NASA WorldView). Processed by Antti
            Lipponen (<ExtLink href="https://twitter.com/anttilip">@anttilip</ExtLink>){' '}
            <ExtLink href="https://creativecommons.org/licenses/by/2.0/">CC-BY</ExtLink>
          </ArticleParagraph>
        </ArticleSection>
      </ArticleContentContainer>
    </ArticleContainer>
  );
};
