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

function dateNowString() {
  const d = new Date(Date.now());
  return d.toISOString().split('T')[0];
}

function yearNowString() {
  const d = new Date(Date.now());
  return d.toISOString().split('-')[0];
}

function localeDateNowString() {
  const d = new Date(Date.now());
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

const BIB_TEXT = `@misc{griViewer,
  title = {Global Resilience Index Risk Viewer},
  author = {Russell, T. and Ziarkowski, M. and Thomas, F. and Nicholas, C. and Pant, R. and Bernhofen, M. and Jaramillo, D. and Leonova, N. and Shiarella, A. and Lestang, T. and Robertson, M. and Lemmen, R. and Glasgow, G. and Fowler, T. and Ranger, N. and Hall, J.~W.},
  publisher={University of Oxford},
  url = {https://global.infrastructureresilience.org/},
  year = {${yearNowString()}}
  urldate = {${dateNowString()}},
}`;

const CITE_TEXT = `Russell, T., et al. ${yearNowString()}. Global Resilience Index Risk Viewer.
[online] Available at: <https://global.infrastructureresilience.org/>
[Accessed ${localeDateNowString()}].`;

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
          Please cite GRI Risk Viewer if you use it, and{' '}
          <ExtLink href="mailto:tom.russell@ouce.ox.ac.uk?subject=GRI Risk Viewer">
            contact us
          </ExtLink>{' '}
          if you can share evidence of use cases. Citations and impact can support continued
          development. For example, cite as follows:
        </ArticleParagraph>

        <ArticleParagraph>
          <blockquote style={{ borderLeft: '4px solid', marginLeft: 0, paddingLeft: '1em' }}>
            {CITE_TEXT}
          </blockquote>
        </ArticleParagraph>

        <ArticleParagraph>Or add this bibtex snippet to your citation manager:</ArticleParagraph>

        <ArticleParagraph>
          <pre
            style={{ overflowX: 'scroll', fontSize: '1rem', background: '#eee', padding: '0.5em' }}
          >
            <code>{BIB_TEXT}</code>
          </pre>
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
          This project is funded by: the UK Natural Environment Research Council (NERC) through the
          UK Centre for Greening Finance and Investment; the World Bank Group; Insurance for
          Development Forum; the UK Foreign Commonwealth and Development Office (FCDO) through the
          Climate Compatible Growth (CCG) programme; and the Global Centre on Adaptation (GCA).
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
          <ExtLink href="https://gca.org/">
            <img height="80" src="/logo-gca.png" alt="Global Centre on Adaptation" />
          </ExtLink>
        </Stack>

        <ArticleParagraph>
          The University of Oxford, in partnership with the Global Centre for Adaptation (GCA),
          developed analytical tools to identify and map opportunities for Nature-based Solutions
          (NbS) projects that enhance infrastructure resilience. These tools establish a common set
          of metrics to robustly quantify the benefits of NbS for infrastructure resilience,
          alongside broader outcomes such as carbon sequestration and biodiversity gains. By
          providing spatial and financial analytics, they help investors and governments prioritize
          NbS investments that offer both financial returns and measurable social benefits.
          Developed at a global scale, these tools facilitate increased financial flows toward NbS
          for climate-resilient infrastructure systems.
        </ArticleParagraph>
        <ArticleParagraph>
          This tool builds on previous research and development funded by UK AID through the UK
          Foreign and Commonwealth Development Office (FCDO) as part of a project with the
          Government of Jamaica (GoJ) under the Coalition for Climate Resilient Investment&rsquo;s
          (CCRI) work on "Systemic Resilience" in collaboration with the Green Climate Fund, and
          also through the High-Volume Transport Applied Research project.
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
          <ExtLink href="https://www.aon.com/home/index">Aon</ExtLink>, the{' '}
          <ExtLink href="https://www.worldbank.org/en/home">World Bank</ExtLink> (
          <ExtLink href="https://www.gfdrr.org/en">GFDRR</ExtLink> and{' '}
          <ExtLink href="https://www.worldbank.org/en/programs/disaster-risk-financing-and-insurance-program">
            DRFIP
          </ExtLink>
          ), and <ExtLink href="https://gca.org">GCA</ExtLink>. Our ambition is to expand these
          technical collaborations over time to build the climate risk data ecosystem.
        </ArticleParagraph>
      </ArticleSection>
    </ArticleContentContainer>
  </ArticleContainer>
);
