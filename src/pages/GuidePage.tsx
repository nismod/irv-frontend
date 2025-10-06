import Link from '@mui/material/Link';

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
  SuperSectionHeader,
} from './ui/ArticleContainer';
import { BackToTop } from './ui/BackToTop';
import { HeadingBox, HeadingBoxText } from './ui/HeadingBox';

export const GuidePage = () => (
  <ArticleContainer>
    <HeadingBox>
      <HeadingBoxText>Guide to concepts and terminology</HeadingBoxText>
    </HeadingBox>
    <ArticleContentContainer>
      <ArticleSection>
        <EmphasisTextContainer>
          <MiniBar />
          <EmphasisTextParagraph>
            This page introduces key concepts and terminology used throughout the GRI Risk Viewer.
          </EmphasisTextParagraph>
        </EmphasisTextContainer>

        <ArticleParagraph>
          <Link id="contents" href="#contents">
            Contents
          </Link>
          <ul>
            <li>
              <Link href="#risk-analysis">Risk analysis</Link>
            </li>
            <li>
              <Link href="#glossary">Glossary</Link>
            </li>
          </ul>
        </ArticleParagraph>
      </ArticleSection>

      <BackToTop id="risk-analysis" />
      <ArticleSection>
        <SuperSectionHeader>Risk analysis</SuperSectionHeader>
        <ArticleParagraph>
          The platform uses globally available open data to display and provide access to data on
          hazards, exposure and risk. In particular, the risk analytics are produced as part of a
          scalable and rapidly deployable method (implemented in the{' '}
          <ExtLink href="https://github.com/nismod/open-gira">Open-GIRA</ExtLink> workflow) aiming
          to analyse direct damages and indirect losses associated with infrastructure networks due
          to climate-related hazards.
        </ArticleParagraph>
        <ArticleParagraph>
          Open-GIRA calculates direct damages to physical assets in a similar way to standard
          catastrophe risk models and climate risk assessment methods. It can process return period
          hazard maps or spatially resolved event sets. The workflow also estimates some of the
          potential indirect losses from disasters, arising from business disruption and
          infrastructure service disruption directly related to the direct impacts (damage or
          destruction of assets). These can be thought of as the first order economic impact on the
          supply chain.
        </ArticleParagraph>
        <ArticleParagraph>
          The two principal use cases of the risk analysis are:
          <ul>
            <li>
              Single asset risk analysis, including comparative analysis between multiple single
              assets. This may also extend to the identification of hotspots of vulnerability by
              comparing single assets across an entire set of assets. Note that while such
              comparative analysis is useful, a full marginal impact (on the total aggregate
              portfolio risk) is likely more informative and can only be conducted as part of a
              portfolio risk analysis.
            </li>
            <li>
              Portfolio risk analysis, that is the aggregation of risk across a portfolio of assets,
              including regional, national, sectoral or network-wide analysis.
            </li>
          </ul>
        </ArticleParagraph>
        <ArticleParagraph>
          The model can use three kinds of hazard data, all of which provide a measure of hazard
          intensity at some spatial resolution over the area of interest:
          <ul>
            <li>
              Return period hazard maps show areas affected by hazards of a particular severity,
              expressed in terms of the return period of the hazard intensity at each grid cell.
              These maps do not reflect realistic hazard events that could occur. Each grid cell is
              treated independently. They are not spatially correlated and do not contain
              information about the duration of the hazard.
            </li>
            <li>
              Spatially resolved event sets map a large range of potential events, incorporating
              information about the potential size, strength, location, path and likelihood of the
              event occurring (e.g. tropical cyclone maximum wind speeds along a track). This
              provides spatially correlated intensity measures across all grid cells in the modelled
              domain and enables the calculation of aggregate losses (e.g. at a national scale) at a
              range of different annual exceedance probabilities.
            </li>
            <li>
              Historic event catalogues are formally equivalent to spatially resolved event sets but
              for observed historical events &ndash; noting that such observations may come from
              reanalysis modelling. Their principle use case is event reconstruction and validation.
              These observed events may have an associated return period estimate.
            </li>
          </ul>
        </ArticleParagraph>
        <ArticleParagraph>
          The type of input hazard data available determines the analysis results that can be relied
          upon by a user. For single asset risk analysis, or simple comparison between assets, all
          output metrics can be calculated from either return period maps or spatially resolved
          event sets. For portfolio risk analysis, return period maps severely limit the output
          metrics available.
        </ArticleParagraph>
        <ArticleParagraph>
          Return period hazard maps do support single asset or comparative risk analysis, but do not
          provide the necessary information to meaningfully aggregate risk results from multiple
          assets to draw conclusions about portfolio, network-wide, regional, or national risks. The
          asset-level analytics can still be calculated for all assets and are suitable for
          comparison and could be used for high-level risk screening or prioritisation.
        </ArticleParagraph>
        <ArticleParagraph>
          Spatially resolved event sets are needed to calculate aggregate losses for different
          exceedance probabilities (or return periods). The GRI Risk Viewer currently only presents
          return period hazard maps and risk results derived from them. There are limited open
          datasets which provide spatially resolved event sets &ndash; notably for tropical
          cyclones, there are the IBTraCS historical storms, STORM and IRIS synthetic event sets.
          This currently limits the possibilities for deriving large-scale aggregate risk analytics.
        </ArticleParagraph>
      </ArticleSection>

      <BackToTop id="glossary" />
      <ArticleSection>
        <SuperSectionHeader>Glossary of terms</SuperSectionHeader>
        <ArticleParagraph>
          This glossary draws on various resources covering climate and disaster risk concepts and
          terminology. The International Panel of Climate Change{' '}
          <ExtLink href="https://apps.ipcc.ch/glossary">IPCC Glossary</ExtLink> gives short
          definitions of key climate-related terms. The United Nations Office for Disaster Risk
          Reduction (UNDRR) has a glossary of
          <ExtLink href="https://www.undrr.org/drr-glossary/terminology">
            Disaster Risk Reduction Terminology
          </ExtLink>{' '}
          and has developed a set of{' '}
          <ExtLink href="https://www.preventionweb.net/drr-glossary/hips">
            Hazard Information Profiles
          </ExtLink>{' '}
          which give concise descriptions of climate-related and other hazards.
        </ArticleParagraph>

        <ArticleSectionHeader>Risk</ArticleSectionHeader>
        <ArticleParagraph>
          The potential for adverse consequences for human or ecological systems, recognising the
          diversity of values and objectives associated with such systems. In the context of climate
          change, risks can arise from potential impacts of climate change as well as human
          responses to climate change. Relevant adverse consequences include those on lives,
          livelihoods, health and well-being, economic, social and cultural assets and investments,
          infrastructure, services (including ecosystem services), ecosystems and species.
        </ArticleParagraph>
        <ArticleParagraph>
          In the context of climate change impacts, risks result from dynamic interactions between
          climate-related hazards with the exposure and vulnerability of the affected human or
          ecological system to the hazards. Hazards, exposure and vulnerability may each be subject
          to uncertainty in terms of magnitude and likelihood of occurrence, and each may change
          over time and space due to socio-economic changes and human decision-making (see also risk
          management, adaptation and mitigation).
        </ArticleParagraph>
        <ArticleParagraph>
          In the context of climate change responses, risks result from the potential for such
          responses not achieving the intended objective(s), or from potential trade-offs with, or
          negative side-effects on, other societal objectives, such as the Sustainable Development
          Goals (SDGs) (see also risk trade-off). Risks can arise, for example, from uncertainty in
          implementation, effectiveness or outcomes of climate policy, climate-related investments,
          technology development or adoption, and system transitions.{' '}
          <cite>
            <ExtLink href="https://apps.ipcc.ch/glossary/">IPCC</ExtLink>
          </cite>
        </ArticleParagraph>

        <ArticleSectionHeader>Hazard</ArticleSectionHeader>
        <ArticleParagraph>
          The potential occurrence of a natural or human-induced physical event or trend that may
          cause loss of life, injury, or other health impacts, as well as damage and loss to
          property, infrastructure, livelihoods, service provision, ecosystems and environmental
          resources.{' '}
          <cite>
            <ExtLink href="https://apps.ipcc.ch/glossary/">IPCC</ExtLink>
          </cite>
        </ArticleParagraph>

        <ArticleSectionHeader>Exposure</ArticleSectionHeader>
        <ArticleParagraph>
          The situation of people, infrastructure, housing, production capacities and other tangible
          human assets located in hazard-prone areas.
        </ArticleParagraph>
        <ArticleParagraph>
          Measures of exposure can include the number of people or types of assets in an area. These
          can be combined with the specific vulnerability and capacity of the exposed elements to
          any particular hazard to estimate the quantitative risks associated with that hazard in
          the area of interest.{' '}
          <cite>
            <ExtLink href="https://www.undrr.org/terminology/exposure">UNDRR</ExtLink>
          </cite>
        </ArticleParagraph>

        <ArticleSectionHeader>Vulnerability</ArticleSectionHeader>
        <ArticleParagraph>
          The propensity or predisposition to be adversely affected. Vulnerability encompasses a
          variety of concepts and elements, including sensitivity or susceptibility to harm and lack
          of capacity to cope and adapt.{' '}
          <cite>
            <ExtLink href="https://apps.ipcc.ch/glossary/">IPCC</ExtLink>
          </cite>
        </ArticleParagraph>

        <ArticleSectionHeader>Representative Concentration Pathway (RCP)</ArticleSectionHeader>
        <ArticleParagraph>
          Scenarios that include time series of emissions and concentrations of the full suite of
          greenhouse gases (GHGs) and aerosols and chemically active gases, as well as land use/land
          cover (Moss et al.,2008; van Vuuren et al., 2011). The word representative signifies that
          each RCP provides only one of many possible scenarios that would lead to the specific
          radiative forcing characteristics. The term pathway emphasises that not only the long-term
          concentration levels are of interest, but also the trajectory taken over time to reach
          that outcome (Moss et al., 2010; van Vuuren et al., 2011).
        </ArticleParagraph>
        <ArticleParagraph>
          RCPs usually refer to the portion of the concentration pathway extending up to 2100, for
          which integrated assessment models produced corresponding emission scenarios. Extended
          concentration pathways describe extensions of the RCPs from 2100 to 2300 that were
          calculated using simple rules generated by stakeholder consultations, and do not represent
          fully consistent scenarios. Four RCPs produced from integrated assessment models were
          selected from the published literature and used in the IPCC Fifth Assessment and are also
          used in this Assessment for comparison, spanning the range from approximately below 2°C
          warming to high (&gt;4°C) warming best-estimates by the end of the 21st century: RCP2.6,
          RCP4.5 and RCP6.0 and RCP8.5.
        </ArticleParagraph>
        <ArticleParagraph>
          RCP2.6: One pathway where radiative forcing peaks at approximately 3 W m⁻² and then
          declines to be limited at 2.6 W m⁻² in 2100 (the corresponding Extended Concentration
          Pathway, or ECP, has constant emissions after 2100).
        </ArticleParagraph>
        <ArticleParagraph>
          RCP4.5 and RCP6.0: Two intermediate stabilisation pathways in which radiative forcing is
          limited at approximately 4.5 W m⁻² and 6.0 W m⁻² in 2100 (the corresponding ECPs have
          constant concentrations after 2150).
        </ArticleParagraph>
        <ArticleParagraph>
          RCP8.5: One high pathway which leads to &gt;8.5 W m⁻² in 2100 (the corresponding ECP has
          constant emissions after 2100 until 2150 and constant concentrations after 2250).{' '}
          <cite>
            <ExtLink href="https://apps.ipcc.ch/glossary/">IPCC</ExtLink>
          </cite>
        </ArticleParagraph>

        <ArticleSectionHeader>Shared Socio-economic Pathway (SSP)</ArticleSectionHeader>
        <ArticleParagraph>
          Shared Socio-economic Pathways (SSPs) have been developed to complement the Representative
          Concentration Pathways (RCPs). By design, the RCP emission and concentration pathways were
          stripped of their association with a certain socio-economic development. Different levels
          of emissions and climate change along the dimension of the RCPs can hence be explored
          against the backdrop of different socio-economic development pathways (SSPs) on the other
          dimension in a matrix. This integrative SSP-RCP framework is now widely used in the
          climate impact and policy analysis literature, where climate projections obtained under
          the RCP scenarios are analysed against the backdrop of various SSPs. As several emissions
          updates were due, a new set of emissions scenarios was developed in conjunction with the
          SSPs. Hence, the abbreviation SSP is now used for two things: On the one hand SSP1, SSP2,
          …, SSP5 are used to denote the five socio-economic scenario families. On the other hand,
          the abbreviations SSP1-1.9, SSP1-2.6, …, SSP5-8.5 are used to denote the newly developed
          emissions scenarios that are the result of an SSP implementation within an integrated
          assessment model. Those SSP scenarios are bare of climate policy assumption, but in
          combination with so-called shared policy assumptions, various approximate radiative
          forcing levels of 1.9, 2.6, …, or 8.5 W m⁻² are reached by the end of the century,
          respectively.{' '}
          <cite>
            <ExtLink href="https://apps.ipcc.ch/glossary/">IPCC</ExtLink>
          </cite>
        </ArticleParagraph>

        <ArticleSectionHeader>Epoch</ArticleSectionHeader>
        <ArticleParagraph>
          A period of time, usually in the context of a changing climate and changing hazards. A
          "baseline" epoch refers to the recent past. Different studies define their baseline
          periods precisely but may take different reference periods: the WRI Aqueduct flood maps
          use hydrological data from 1960 to 1999, whereas the IRIS tropical cyclone dataset uses
          storm tracks from 1980 to 2021. Future epochs, for example those centered on 2030, 2050,
          or 2080, represent the projected conditions around those decades in the future.
        </ArticleParagraph>

        <ArticleSectionHeader>Direct and Indirect Losses</ArticleSectionHeader>
        <ArticleParagraph>
          Direct disaster losses refer to directly quantifiable losses such as the number of people
          killed and the damage to buildings, infrastructure and natural resources. Indirect
          disaster losses include declines in output or revenue, and impact on wellbeing of people,
          and generally arise from disruptions to the flow of goods and services as a result of a
          disaster.{' '}
          <cite>
            <ExtLink href="https://www.preventionweb.net/understanding-disaster-risk/key-concepts/direct-indirect-losses">
              Prevention Web
            </ExtLink>
          </cite>
        </ArticleParagraph>

        <ArticleSectionHeader>Expected Annual Damages</ArticleSectionHeader>
        <ArticleParagraph>
          Expected Annual Damages (EAD) are the average damage costs incurred for an asset in any
          given year due to a given hazard type for a given time epoch and climate scenario. EAD is
          calculated by summing the probability-weighted damages at different return periods.
        </ArticleParagraph>

        <ArticleSectionHeader>Expected Annual Economic Losses</ArticleSectionHeader>
        <ArticleParagraph>
          Expected Annual Economic Losses (EAEL) are the average economic losses incurred following
          the damages to an asset in any given year due to a given hazard type for a given time
          epoch and climate scenario
        </ArticleParagraph>

        <ArticleSectionHeader>Return Period</ArticleSectionHeader>
        <ArticleParagraph>
          An estimate of the average time interval between occurrences of an event (e.g., flood or
          extreme rainfall) of (or below/above) a defined size or intensity.{' '}
          <cite>
            <ExtLink href="https://apps.ipcc.ch/glossary/">IPCC</ExtLink>
          </cite>
        </ArticleParagraph>

        <ArticleSectionHeader>Return Period Damages</ArticleSectionHeader>
        <ArticleParagraph>
          Return period damages are calculated for an asset, for a set of hazard intensities
          corresponding to a set of return periods.
        </ArticleParagraph>
        <ArticleParagraph>
          For example, the set of river flooding hazard maps gives the flood depths (at each grid
          cell location) that are expected to be exceeded every 2, 5, 10, 25, 50, 100, 250, 500 or
          1000 years. This might be 0.06m, 0.1m, …, 0.65m. Then for each of those return period
          depths, the damage can be calculated &ndash; for a paved road this might be insignificant
          below 0.5m, and some proportional repair or rehabilitation cost for higher depths.
        </ArticleParagraph>
      </ArticleSection>
      <BackToTop id="end" />
    </ArticleContentContainer>
  </ArticleContainer>
);
