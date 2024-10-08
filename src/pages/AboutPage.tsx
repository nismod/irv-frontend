import { Stack } from '@mui/material';
import { Link } from 'react-router-dom';

import { ExtLink } from '@/lib/nav';

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
import { HeadingBox, HeadingBoxText } from './ui/HeadingBox';

export const AboutPage = () => (
  <ArticleContainer>
    <HeadingBox>
      <HeadingBoxText>About the GRI Risk Viewer</HeadingBoxText>
    </HeadingBox>
    <ArticleContentContainer>
      <ArticleSection>
        <EmphasisTextContainer>
          <MiniBar />
          <EmphasisTextParagraph>
            The GRI Risk Viewer is developed by the Oxford Programme for Sustainable Infrastructure
            Systems (<ExtLink href="https://opsis.eci.ox.ac.uk">OPSIS</ExtLink>) at the University
            of Oxford.
          </EmphasisTextParagraph>
        </EmphasisTextContainer>
        <ArticleParagraph>
          This website and supporting data, modelling and analysis work has been developed by
          researchers at the University of Oxford in the UK:
          <ul>
            <li>Tom Russell, technical lead</li>
            <li>Maciej Ziarkowski, frontend</li>
            <li>Fred Thomas, analytics and backend</li>
            <li>Chris Nicholas, data preparation and backend</li>
            <li>Raghav Pant, risk methodology</li>
            <li>Mark Bernhofen, hazard data review and stakeholder engagement</li>
            <li>Diana Jaramillo, accessibility data review</li>
            <li>Nadia Leonova, introductory text and review</li>
            <li>Alexander Shiarella, frontend development</li>
            <li>Thibault Lestang, analytical workflow</li>
            <li>Max Robertson, analytical workflow</li>
            <li>Roald Lemmen, early visualisation development</li>
            <li>Gordon Glasgow, early analytical workflow development</li>
            <li>Tim Fowler, project management</li>
            <li>Nicola Ranger, discussion, direction and feedback</li>
            <li>Jim Hall, discussion, direction and feedback</li>
          </ul>
        </ArticleParagraph>

        <ArticleParagraph>
          This website and the supporting data, analysis and modelling workflows are developed on
          GitHub:
          <ul>
            <li>
              <ExtLink href="https://github.com/nismod/infra-risk-vis">
                <code>infra-risk-vis</code>
              </ExtLink>{' '}
              &ndash; web application
            </li>
            <li>
              <ExtLink href="https://github.com/nismod/irv-frontend">
                <code>irv-frontend</code>
              </ExtLink>{' '}
              &ndash; web frontend
            </li>
            <li>
              <ExtLink href="https://github.com/nismod/irv-datapkg">
                <code>irv-datapkg</code>
              </ExtLink>{' '}
              &ndash; data package (downloads) preparation
            </li>
            <li>
              <ExtLink href="https://github.com/nismod/open-gira">
                <code>open-gira</code>
              </ExtLink>{' '}
              &ndash; risk analysis and modelling workflow
            </li>
          </ul>
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleSectionHeader>Funding and support</ArticleSectionHeader>

        <ArticleParagraph>
          This project has contributions of data from the{' '}
          <ExtLink href="https://www.globalquakemodel.org/who-we-are">
            Global Earthquake Model Foundation
          </ExtLink>{' '}
          and the{' '}
          <ExtLink href="https://www.cgfi.ac.uk/spatial-finance-initiative/">
            Spatial Finance Initiative
          </ExtLink>{' '}
          as part of the{' '}
          <ExtLink href="https://resilient-planet-data.org/">Resilient Planet Initiative</ExtLink>,
          previously the Global Resilience Index Initiative (GRII) as well as the many open data
          sources listed <Link to="/data">here</Link>. Appropriate open data sources are regularly
          reviewed.
        </ArticleParagraph>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          flexWrap="wrap"
          sx={{ mb: 2 }}
          justifyContent="center"
          alignItems="center"
        >
          <ExtLink href="https://resilient-planet-data.org/">
            <img
              height="80"
              src="/logo-resilient-planet.png"
              style={{ marginTop: '2rem' }}
              alt="Resilient Planet Data Hub"
            />
          </ExtLink>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          flexWrap="wrap"
          spacing={{ md: 1, lg: 4 }}
          sx={{ mt: 4, mb: 2 }}
          justifyContent="center"
          alignItems="center"
        >
          <ExtLink href="https://ukcgfi.org/">
            <img height="60" src="/logo-cgfi.png" alt="CGFI" />
          </ExtLink>
          <ExtLink href="https://resilientinvestment.org/">
            <img height="80" src="/logo-ccri.png" alt="CCRI" />
          </ExtLink>
          <ExtLink href="https://www.cdri.world/">
            <img height="70" src="/logo-cdri.png" alt="CDRI" />
          </ExtLink>
          <ExtLink href="https://www.globalquakemodel.org/who-we-are">
            <img height="55" src="/logo-gem.png" alt="GEM" />
          </ExtLink>
          <ExtLink href="https://www.insdevforum.org/">
            <img height="40" src="/logo-idf.png" alt="IDF" />
          </ExtLink>
          <ExtLink href="https://www.undrr.org/">
            <img height="50" src="/logo-undrr.png" alt="UNDRR" />
          </ExtLink>
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
          <ExtLink href="https://www.ukri.org/councils/nerc/">
            <img height="60" src="/logo-nerc.png" alt="NERC" />
          </ExtLink>
          <ExtLink href="https://www.worldbank.org/en/home">
            <img height="40" src="/logo-wbg.png" alt="World Bank Group" />
          </ExtLink>
          <ExtLink href="https://www.insdevforum.org/">
            <img height="40" src="/logo-idf.png" alt="IDF" />
          </ExtLink>
          <ExtLink href="https://www.gov.uk/international/international-aid-and-development">
            <img height="100" src="/logo-uk-aid.png" alt="UK Aid" />
          </ExtLink>
          <ExtLink href="https://climatecompatiblegrowth.com/">
            <img height="100" src="/logo-ccg.png" alt="Climate Compatible Growth" />
          </ExtLink>
        </Stack>

        <ArticleParagraph>
          This builds on previous research and development funded by UK AID through the UK Foreign
          and Commonwealth Development Office (FCDO) as part of a project with the Government of
          Jamaica (GoJ) under the Coalition for Climate Resilient Investment&rsquo;s (CCRI) work on
          "Systemic Resilience" in collaboration with the Green Climate Fund, and also through the
          High-Volume Transport Applied Research project.
        </ArticleParagraph>
        <ArticleParagraph>
          Similarly, earlier versions of the tool piloted in Argentina and South-East Asia were
          funded by the Disaster Risk Financing and Insurance Program (DRFIP) of the World Bank with
          support from the Japan—World Bank Program for Mainstreaming DRM in Developing Countries,
          which is financed by the Government of Japan and managed by the Global Facility for
          Disaster Reduction and Recovery (GFDRR) through the Tokyo Disaster Risk Management Hub.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleSectionHeader>Disclaimer</ArticleSectionHeader>

        <ArticleParagraph>
          This tool is provided for general information only and is not intended to amount to advice
          on which you should rely. You must obtain professional or specialist advice before taking,
          or refraining from, any action on the basis of the content on our site.
        </ArticleParagraph>

        <ArticleParagraph>
          Although we make reasonable efforts to update the information on our site, we make no
          representations, warranties or guarantees, whether express or implied, that the content on
          our site (including this tool) is accurate, complete or up to date. The University of
          Oxford accepts no liability in relation to any issues or liabilities that may subsequently
          arise from use of the data or this tool for any purpose. Please consult our{' '}
          <Link to="/terms-of-use">website terms of use</Link> for more information about our
          liability to you.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleSectionHeader>Acknowledgments</ArticleSectionHeader>

        <ArticleParagraph>
          The development of this site is led by the University of Oxford (the{' '}
          <ExtLink href="https://opsis.eci.ox.ac.uk/">
            Oxford Programme for Sustainable Infrastructure Systems
          </ExtLink>
          ). It is supported by a wide range of contributing technical organisations and specialists
          that share data, analytics and expertise, including: the{' '}
          <ExtLink href="https://www.smithschool.ox.ac.uk/research/sustainable-finance">
            University of Oxford Sustainable Finance Group
          </ExtLink>
          , the{' '}
          <ExtLink href="https://www.insdevforum.org/working-groups/rmsg/">
            Insurance Development Forum’s Risk Modelling Steering Group
          </ExtLink>{' '}
          (RMSG), the{' '}
          <ExtLink href="https://www.globalquakemodel.org/who-we-are">
            Global Earthquake Model Foundation
          </ExtLink>{' '}
          (GEM), the{' '}
          <ExtLink href="https://www.disasterprotection.org/">
            Centre for Disaster Protection
          </ExtLink>
          , <ExtLink href="https://www.fathom.global/">Fathom</ExtLink>,{' '}
          <ExtLink href="https://www.jbarisk.com/">JBA</ExtLink>,{' '}
          <ExtLink href="https://www.nasdaq.com/solutions/nasdaq-risk-platform">NASDAQ</ExtLink>,{' '}
          <ExtLink href="https://oasislmf.org/">OASIS Loss Modelling Framework</ExtLink>,{' '}
          <ExtLink href="https://www.aon.com/home/index">Aon</ExtLink>, and the{' '}
          <ExtLink href="https://www.worldbank.org/en/home">World Bank</ExtLink> (
          <ExtLink href="https://www.gfdrr.org/en">GFDRR</ExtLink> and{' '}
          <ExtLink href="https://www.worldbank.org/en/programs/disaster-risk-financing-and-insurance-program">
            DRFIP
          </ExtLink>
          ). Our ambition is to expand these technical collaborations over time to build the climate
          risk data ecosystem.
        </ArticleParagraph>
      </ArticleSection>
    </ArticleContentContainer>
  </ArticleContainer>
);
