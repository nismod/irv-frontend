import { Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

import {
  ArticleContainer,
  ArticleContentContainer,
  ArticleParagraph,
  ArticleSection,
  ArticleSectionHeader,
  EmphasisTextContainer,
  EmphasisTextParagraph,
  ExternalLink,
  MiniBar,
} from './ui/ArticleContainer';
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
              The GRI Risk Viewer, previously called the Global Systemic Risk Assessment Tool
              (G-SRAT), is a data and analytics portal covering hazards, exposure, vulnerability and
              risk to infrastructure and people around the world.
            </EmphasisTextParagraph>

            <EmphasisTextParagraph>
              This tool aims to support climate adaptation decision-making by identifying spatial
              vulnerabilities and risks under current and future climate scenarios.
            </EmphasisTextParagraph>
          </EmphasisTextContainer>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            flexWrap="wrap"
            divider={<Divider orientation="vertical" flexItem />}
            justifyContent="center"
            alignItems="center"
            spacing={2}
            mb={6}
          >
            <ExternalLink href="https://opsis.eci.ox.ac.uk">
              <img
                height="120"
                src="/logo-opsis.png"
                alt="Oxford Programme for Sustainable Infrastructure Systems"
              />
            </ExternalLink>
          </Stack>

          <ArticleParagraph>
            The research, analysis and development of G-SRAT is led by researchers in the{' '}
            <ExternalLink href="https://opsis.eci.ox.ac.uk/">
              {' '}
              Oxford Programme for Sustainable Infrastructure Systems
            </ExternalLink>{' '}
            at the University of Oxford.
          </ArticleParagraph>
        </ArticleSection>

        <ArticleSection>
          <ArticleSectionHeader>Funding and support</ArticleSectionHeader>

          <ArticleParagraph>
            This project has contributions of data from the{' '}
            <ExternalLink href="https://www.globalquakemodel.org/who-we-are">
              Global Earthquake Model Foundation
            </ExternalLink>{' '}
            and the{' '}
            <ExternalLink href="https://www.cgfi.ac.uk/spatial-finance-initiative/">
              Spatial Finance Initiative
            </ExternalLink>{' '}
            as part of the{' '}
            <ExternalLink href="http://www.globalresilienceindex.org/">
              Global Resilience Index Initiative
            </ExternalLink>{' '}
            (GRII) as well as the many open data sources listed <Link to="/data">here</Link>.
            Appropriate open data sources are regularly reviewed as part of the GRII taskforce.
          </ArticleParagraph>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            flexWrap="wrap"
            sx={{ mt: 6, mb: 2 }}
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <ExternalLink href="http://www.globalresilienceindex.org/">
              <img height="80" src="/logo-resilient-planet.png" alt="Resilient Planet Data Hub" />
            </ExternalLink>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            flexWrap="wrap"
            spacing={{ md: 1, lg: 4 }}
            sx={{ mt: 4, mb: 2 }}
            justifyContent="center"
            alignItems="center"
          >
            <ExternalLink href="https://ukcgfi.org/">
              <img height="60" src="/logo-cgfi.png" alt="CGFI" />
            </ExternalLink>
            <ExternalLink href="https://resilientinvestment.org/">
              <img height="80" src="/logo-ccri.png" alt="CCRI" />
            </ExternalLink>
            <ExternalLink href="https://www.cdri.world/">
              <img height="70" src="/logo-cdri.png" alt="CDRI" />
            </ExternalLink>
            <ExternalLink href="https://www.globalquakemodel.org/who-we-are">
              <img height="55" src="/logo-gem.png" alt="GEM" />
            </ExternalLink>
            <ExternalLink href="https://www.insdevforum.org/">
              <img height="40" src="/logo-idf.png" alt="IDF" />
            </ExternalLink>
            <ExternalLink href="https://www.undrr.org/">
              <img height="50" src="/logo-undrr.png" alt="UNDRR" />
            </ExternalLink>
          </Stack>

          <ArticleParagraph>
            This project is funded by the UK Natural Environment Research Council (NERC) through the
            UK Centre for Greening Finance and Investment, the World Bank Group, Insurance for
            Development Forum, and the UK Foreign Commonwealth and Development Office (FCDO) through
            the Climate Compatible Growth (CCG) programme.
          </ArticleParagraph>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            flexWrap="wrap"
            spacing={{ md: 1, lg: 4 }}
            sx={{ mt: 4, mb: 2 }}
            justifyContent="center"
            alignItems="center"
          >
            <ExternalLink href="https://www.ukri.org/councils/nerc/">
              <img height="60" src="/logo-nerc.png" alt="NERC" />
            </ExternalLink>
            <ExternalLink href="https://www.worldbank.org/en/home">
              <img height="40" src="/logo-wbg.png" alt="World Bank Group" />
            </ExternalLink>
            <ExternalLink href="https://www.insdevforum.org/">
              <img height="40" src="/logo-idf.png" alt="IDF" />
            </ExternalLink>
            <ExternalLink href="https://www.gov.uk/international/international-aid-and-development">
              <img height="100" src="/logo-uk-aid.png" alt="UK Aid" />
            </ExternalLink>
            <ExternalLink href="https://climatecompatiblegrowth.com/">
              <img height="120" src="/logo-ccg.png" alt="Climate Compatible Growth" />
            </ExternalLink>
          </Stack>

          <ArticleParagraph>
            This builds on previous research and development funded by UK AID through the UK Foreign
            and Commonwealth Development Office (FCDO) as part of a project with the Government of
            Jamaica (GoJ) under the Coalition for Climate Resilient Investment&rsquo;s (CCRI) work
            on "Systemic Resilience" in collaboration with the Green Climate Fund, and also through
            the High-Volume Transport Applied Research project.
          </ArticleParagraph>
          <ArticleParagraph>
            Similarly, earlier versions of the tool piloted in Argentina and South-East Asia were
            funded by the Disaster Risk Financing and Insurance Program (DRFIP) of the World Bank
            with support from the Japan—World Bank Program for Mainstreaming DRM in Developing
            Countries, which is financed by the Government of Japan and managed by the Global
            Facility for Disaster Reduction and Recovery (GFDRR) through the Tokyo Disaster Risk
            Management Hub.
          </ArticleParagraph>
        </ArticleSection>

        <ArticleSection>
          <ArticleSectionHeader>Disclaimer</ArticleSectionHeader>

          <ArticleParagraph>
            This tool is provided for general information only and is not intended to amount to
            advice on which you should rely. You must obtain professional or specialist advice
            before taking, or refraining from, any action on the basis of the content on our site.
          </ArticleParagraph>

          <ArticleParagraph>
            Although we make reasonable efforts to update the information on our site, we make no
            representations, warranties or guarantees, whether express or implied, that the content
            on our site (including this tool) is accurate, complete or up to date. The University of
            Oxford accepts no liability in relation to any issues or liabilities that may
            subsequently arise from use of the data or this tool for any purpose. Please consult our{' '}
            <Link to="/terms-of-use">website terms of use</Link> for more information about our
            liability to you.
          </ArticleParagraph>
        </ArticleSection>
      </ArticleContentContainer>
    </ArticleContainer>
  );
};
