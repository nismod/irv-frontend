import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useAtomValue } from 'jotai';
import _ from 'lodash';
import { FC, ReactElement } from 'react';

import { Layer } from '@/lib/data-selection/sidebar/Layer';
import {
  makeSectionViewTransitionEffect,
  type SectionViewTransitionConfig,
} from '@/lib/data-selection/sidebar/make-section-view-transition-effect';
import { SidebarRoot } from '@/lib/data-selection/sidebar/root';
import { Section } from '@/lib/data-selection/sidebar/Section';
import { EnforceSingleChildVisible } from '@/lib/data-selection/sidebar/single-child';
import { atomEffectWithPrevious } from '@/lib/jotai/effects/atom-effect-with-previous';
import { AtomEffectRoot } from '@/lib/jotai/effects/AtomEffectRoot';

import { viewAtom, ViewType } from '@/state/view';

import { NbsAdaptationSection } from './sections/adaptation/NbsAdaptationSection';
import { BuildingDensityControl } from './sections/buildings/BuildingDensityControl';
import {
  CoastalControl,
  CycloneControl,
  DroughtControl,
  EarthquakeControl,
  ExtremeHeatControl,
  FluvialControl,
  LandslideControl,
} from './sections/hazards/HazardsControl';
import { IndustryControl } from './sections/industry/IndustryControl';
import { NetworkControl } from './sections/networks/NetworkControl';
import { CDDControl } from './sections/risk/CDDControl';
import { InfrastructureRiskSection } from './sections/risk/infrastructure-risk';
import { PopulationExposureSection } from './sections/risk/population-exposure';
import { RegionalRiskSection } from './sections/risk/regional-risk';
import { TopographyControl } from './sections/topography/TopographyControl';
import { HdiControl } from './sections/vulnerability/HdiControl';
import { TravelTimeControl } from './sections/vulnerability/TravelTimeControl';
import { WdpaControls } from './sections/vulnerability/WdpaControl';
import {
  sidebarExpandedAtomFamily,
  sidebarPathChildrenAtomFamily,
  sidebarPathChildrenLoadingAtomFamily,
  sidebarPathVisibilityAtomFamily,
  sidebarVisibilityToggleAtomFamily,
} from './sidebar-state';
import { SidebarSectionsUrlSync } from './SidebarSectionsUrlSync';
import { DataNotice, DataNoticeTextBlock } from './ui/DataNotice';

const viewLabels = {
  hazard: 'Hazard',
  exposure: 'Exposure',
  vulnerability: 'Vulnerability',
  risk: 'Risk',
  adaptation: 'Adaptation Options',
};

const HazardsSection = () => (
  <Section path="hazards" title="Hazards">
    <Layer path="fluvial" title="River Flooding">
      <FluvialControl />
    </Layer>
    <Layer path="coastal" title="Coastal Flooding (Aqueduct)">
      <CoastalControl />
    </Layer>
    <Layer path="cyclone" title="Tropical Cyclones">
      <CycloneControl />
    </Layer>
    <Layer path="cdd" title="Cooling degree days">
      <DataNotice>
        <DataNoticeTextBlock>
          Change in cooling degree days with global mean temperature rise increasing from 1.5°C to
          2.0°C, from Miranda et al. (2023).
        </DataNoticeTextBlock>
      </DataNotice>
      <CDDControl />
    </Layer>
    <Layer path="extreme_heat" title="Extreme Heat">
      <ExtremeHeatControl />
    </Layer>
    <Layer path="drought" title="Droughts">
      <DroughtControl />
    </Layer>
    <Layer path="landslide" title="Landslide">
      <LandslideControl />
    </Layer>
    <Layer path="earthquake" title="Earthquakes">
      <EarthquakeControl />
    </Layer>
    <Layer path="wildfire" title="Wildfires" disabled />
  </Section>
);

const ExposureSection = () => (
  <Section path="exposure" title="Exposure">
    <Layer path="population" title="Population">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows population density in 2020, from the JRC Global Human Settlement Layer (2022).
        </DataNoticeTextBlock>
      </DataNotice>
    </Layer>
    <Layer path="buildings" title="Buildings">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows density of built-up surface in 2020, from the JRC Global Human Settlement Layer
          (2022).
        </DataNoticeTextBlock>
      </DataNotice>
      <BuildingDensityControl />
    </Layer>
    <Layer path="infrastructure" title="Infrastructure">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows infrastructure networks: road and rail derived from OpenStreetMap, power from
          Gridfinder, Arderne et al (2020).
        </DataNoticeTextBlock>
      </DataNotice>
      <NetworkControl />
    </Layer>
    <Layer path="industry" title="Industry">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows global databases of cement, iron and steel production assets, from the Spatial
          Finance Initiative, McCarten et al (2021).
        </DataNoticeTextBlock>
      </DataNotice>
      <IndustryControl />
    </Layer>
    <Layer path="healthsites" title="Healthcare">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows locations of healthcare facilities from the healthsites.io project, containing
          data extracted from OpenStreetMap.
        </DataNoticeTextBlock>
      </DataNotice>
    </Layer>
    <Layer path="land-cover" title="Land Cover">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows land cover classification gridded maps from the European Space Agency Climate
          Change Initiative Land Cover project (2021).
        </DataNoticeTextBlock>
      </DataNotice>
    </Layer>
    <Layer path="topography" title="Topography">
      <DataNotice>
        <DataNoticeTextBlock>
          Elevation (m) and slope (°) from Hengl (2018) Global DEM derivatives at 250m based on the
          MERIT DEM, displayed to nearest ~10m or degree.
        </DataNoticeTextBlock>
      </DataNotice>
      <TopographyControl />
    </Layer>
    <Layer path="organic-carbon" title="Soil Organic Carbon">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows soil organic carbon content at 0-30cm, in tonnes/hectare, aggregated to a 1000m
          grid, from SoilGrids 2.0, Poggio et al (2021).
        </DataNoticeTextBlock>
      </DataNotice>
    </Layer>
  </Section>
);

const VulnerabilitySection = () => (
  <Section path="vulnerability" title="Vulnerability">
    <Section path="human" title="People">
      <Layer path="human-development" title="Human Development (Subnational)">
        <HdiControl />
      </Layer>
      <Layer path="hdi-grid" title="Human Development (Grid)">
        <DataNotice>
          <DataNoticeTextBlock>
            Global estimates of United Nations Human Development Index (HDI) on a global 0.1 degree
            grid, from Sherman, L., et al. (2023).
          </DataNoticeTextBlock>
        </DataNotice>
      </Layer>
      <Layer path="rwi" title="Relative Wealth Index">
        <DataNotice>
          <DataNoticeTextBlock>
            Predicts the relative standard of living within countries using privacy protecting
            connectivity data, satellite imagery, and other novel data sources, from Chi et al.
            (2022).
          </DataNoticeTextBlock>
        </DataNotice>
      </Layer>
      <Layer path="travel-time" title="Travel Time to Healthcare">
        <TravelTimeControl />
      </Layer>
    </Section>
    <Section path="nature" title="Planet">
      <Layer path="biodiversity-intactness" title="Biodiversity Intactness">
        <DataNotice>
          <DataNoticeTextBlock>
            Map shows Biodiversity Intactness Index, from Newbold et al. (2016).
          </DataNoticeTextBlock>
        </DataNotice>
      </Layer>
      <Layer path="forest-integrity" title="Forest Landscape Integrity">
        <DataNotice>
          <DataNoticeTextBlock>
            Map shows Forest Landscape Integrity Index, from Grantham et al. (2020).
          </DataNoticeTextBlock>
        </DataNotice>
      </Layer>
      <Layer path="protected-areas" title="Protected Areas (WDPA)">
        <WdpaControls />
      </Layer>
    </Section>
  </Section>
);

const RiskSection = () => (
  <Section path="risk" title="Risk">
    <EnforceSingleChildVisible />
    <Layer path="population" title="Population Exposure" unmountOnHide={true}>
      <PopulationExposureSection />
    </Layer>
    <Layer path="infrastructure" title="Infrastructure Risk" unmountOnHide={true}>
      <InfrastructureRiskSection />
    </Layer>
    <Layer path="regional" title="Regional Summary" unmountOnHide={true}>
      <RegionalRiskSection />
    </Layer>
  </Section>
);

const AdaptationSection = () => (
  <Section path="adaptation" title="Adaptation Options">
    <Layer path="nbs" title="Nature-Based Solutions">
      <NbsAdaptationSection />
    </Layer>
  </Section>
);

/** Top-level section paths — must match `<Section path="…">` roots below. */
const TOP_LEVEL_SECTIONS = ['hazards', 'exposure', 'vulnerability', 'risk', 'adaptation'] as const;

const VIEW_TRANSITIONS = {
  hazard: {
    enter: {
      showPaths: ['hazards'],
      hideOtherTopLevel: true,
    },
    exit: {
      hidePaths: ['hazards'],
    },
  },
  exposure: {
    enter: {
      showPaths: ['exposure'],
      hideOtherTopLevel: true,
    },
    exit: {
      hidePaths: ['exposure'],
    },
  },
  vulnerability: {
    enter: {
      showPaths: ['vulnerability', 'vulnerability/human', 'vulnerability/nature'],
      hideOtherTopLevel: true,
    },
    exit: {
      hidePaths: ['vulnerability'],
    },
  },
  risk: {
    enter: {
      showPaths: ['risk'],
      hideOtherTopLevel: true,
    },
    exit: {
      hidePaths: ['risk'],
    },
  },
  adaptation: {
    enter: {
      showPaths: ['adaptation', 'adaptation/nbs'],
      hideOtherTopLevel: true,
    },
    exit: {
      hidePaths: ['adaptation'],
    },
  },
} satisfies SectionViewTransitionConfig<ViewType>;

const viewTransitionEffectAtom = atomEffectWithPrevious(
  viewAtom,
  makeSectionViewTransitionEffect(
    VIEW_TRANSITIONS,
    TOP_LEVEL_SECTIONS,
    sidebarExpandedAtomFamily,
    sidebarVisibilityToggleAtomFamily,
  ),
);

export const SidebarContent: FC<{}> = () => {
  const view = useAtomValue(viewAtom);

  const knownViews = Object.keys(viewLabels);
  if (!knownViews.includes(view)) {
    return <Alert severity="error">Unknown view!</Alert>;
  }

  const sections: Record<ViewType, ReactElement> = {
    hazard: <HazardsSection key="hazard" />,
    exposure: <ExposureSection key="exposure" />,
    vulnerability: <VulnerabilitySection key="vulnerability" />,
    risk: null,
    adaptation: null,
  };

  if (view === 'risk') {
    sections['risk'] = <RiskSection key="risk" />;
  }

  if (view === 'adaptation') {
    sections['adaptation'] = <AdaptationSection key="adaptation" />;
  }

  return (
    <SidebarRoot
      visibilityAtomFamily={sidebarVisibilityToggleAtomFamily}
      hierarchicalVisibilityAtomFamily={sidebarPathVisibilityAtomFamily}
      expandedAtomFamily={sidebarExpandedAtomFamily}
      pathChildrenAtomFamily={sidebarPathChildrenAtomFamily}
      pathChildrenLoadingAtomFamily={sidebarPathChildrenLoadingAtomFamily}
    >
      <SidebarSectionsUrlSync />
      <AtomEffectRoot effectAtom={viewTransitionEffectAtom} />
      <Stack
        sx={{
          '& > :first-of-type': {
            marginBottom: 2,
          },
        }}
      >
        {sections[view]}

        {_.map(sections, (sectionElement, sectionView) => sectionView !== view && sectionElement)}
      </Stack>
    </SidebarRoot>
  );
};
