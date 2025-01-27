import { Alert, Stack } from '@mui/material';
import _ from 'lodash';
import { FC, ReactElement } from 'react';
import { atomFamily, useRecoilValue } from 'recoil';

import { makeHierarchicalVisibilityState } from '@/lib/data-selection/make-hierarchical-visibility-state';
import { Layer } from '@/lib/data-selection/sidebar/Layer';
import { SidebarRoot } from '@/lib/data-selection/sidebar/root';
import { Section } from '@/lib/data-selection/sidebar/Section';
import { EnforceSingleChild } from '@/lib/data-selection/sidebar/single-child';
import { StateEffectRootAsync } from '@/lib/recoil/state-effects/StateEffectRoot';
import { RecoilStateFamily } from '@/lib/recoil/types';

import { viewState, ViewType } from '@/state/view';

import { BuildingDensityControl } from './sections/buildings/BuildingDensityControl';
import {
  CoastalControl,
  CycloneControl,
  CycloneIrisControl,
  DroughtControl,
  EarthquakeControl,
  ExtremeHeatControl,
  FluvialControl,
  JRCFloodControl,
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
import { DataNotice, DataNoticeTextBlock } from './ui/DataNotice';
import { defaultSectionVisibilitySyncEffect, SidebarUrlStateSyncRoot } from './url-state';

const viewLabels = {
  hazard: 'Hazard',
  exposure: 'Exposure',
  vulnerability: 'Vulnerability',
  risk: 'Risk',
};

export const sidebarVisibilityToggleState = atomFamily({
  key: 'sidebarVisibilityToggleState',
  effects: (path: string) => [defaultSectionVisibilitySyncEffect(path)],
});

export const sidebarExpandedState = atomFamily({
  key: 'sidebarExpandedState',
  default: sidebarVisibilityToggleState,
});

export const sidebarPathChildrenState = atomFamily<string[], string>({
  key: 'sidebarPathChildrenState',
  default: () => [],
});

export const sidebarPathChildrenLoadingState = atomFamily<boolean, string>({
  key: 'sidebarPathChildrenLoadingState',
  default: true,
});

export const sidebarPathVisibilityState: RecoilStateFamily<boolean, string> =
  makeHierarchicalVisibilityState(sidebarVisibilityToggleState);

const HazardsSection = () => (
  <Section path="hazards" title="Hazards">
    <Layer path="fluvial" title="River Flooding (Aqueduct)">
      <FluvialControl />
    </Layer>
    <Layer path="jrc_flood" title="River Flooding (JRC)">
      <JRCFloodControl />
    </Layer>
    <Layer path="coastal" title="Coastal Flooding (Aqueduct)">
      <CoastalControl />
    </Layer>
    <Layer path="cyclone" title="Tropical Cyclones (STORM)">
      <CycloneControl />
    </Layer>
    <Layer path="cyclone_iris" title="Tropical Cyclones (IRIS)">
      <CycloneIrisControl />
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
    <EnforceSingleChild />
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

const TOP_LEVEL_SECTIONS = ['hazards', 'exposure', 'vulnerability', 'risk'];

const VIEW_TRANSITIONS: Record<ViewType, any> = {
  hazard: {
    enter: {
      showPaths: ['hazards'],
      hideRest: true,
    },
    exit: {
      hidePaths: ['hazards'],
    },
  },
  exposure: {
    enter: {
      showPaths: ['exposure'],
      hideRest: true,
    },
    exit: {
      hidePaths: ['exposure'],
    },
  },
  vulnerability: {
    enter: {
      showPaths: ['vulnerability', 'vulnerability/human', 'vulnerability/nature'],
      hideRest: true,
    },
    exit: {
      hidePaths: ['vulnerability'],
    },
  },
  risk: {
    enter: {
      showPaths: ['risk'],
      hideRest: true,
    },
    exit: {
      hidePaths: ['risk'],
    },
  },
};

const viewTransitionEffect = ({ set }, newView, previousView) => {
  if (newView === previousView) return;

  const { showPaths = [], hideRest = false } = VIEW_TRANSITIONS[newView].enter;

  for (const path of showPaths) {
    set(sidebarExpandedState(path), true);
    set(sidebarVisibilityToggleState(path), true);
  }

  // hide other sections, but only if we're transitioning from a previous view
  if (previousView != null && hideRest) {
    const hidePaths = _.difference(TOP_LEVEL_SECTIONS, showPaths);

    for (const path of hidePaths) {
      set(sidebarExpandedState(path), false);
      set(sidebarVisibilityToggleState(path), false);
    }
  }
};

export const SidebarContent: FC<{}> = () => {
  const view = useRecoilValue(viewState);

  const knownViews = Object.keys(viewLabels);
  if (!knownViews.includes(view)) {
    return <Alert severity="error">Unknown view!</Alert>;
  }

  const sections: Record<ViewType, ReactElement> = {
    hazard: <HazardsSection key="hazard" />,
    exposure: <ExposureSection key="exposure" />,
    vulnerability: <VulnerabilitySection key="vulnerability" />,
    risk: null,
  };

  if (view === 'risk') {
    sections['risk'] = <RiskSection key="risk" />;
  }

  return (
    <SidebarRoot
      visibilityState={sidebarVisibilityToggleState}
      expandedState={sidebarExpandedState}
      pathChildrenState={sidebarPathChildrenState}
      pathChildrenLoadingState={sidebarPathChildrenLoadingState}
    >
      <SidebarUrlStateSyncRoot />
      <StateEffectRootAsync state={viewState} effect={viewTransitionEffect} hookType="effect" />
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
