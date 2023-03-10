import { Alert, Stack } from '@mui/material';
import _ from 'lodash';
import { FC, ReactElement } from 'react';
import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';

import { Layer, Section, SidebarRoot } from '@/lib/data-selection/sidebar/components';
import { getParentPath } from '@/lib/data-selection/sidebar/paths';
import { EnforceSingleChild } from '@/lib/data-selection/sidebar/single-child';
import { StateEffectRoot } from '@/lib/recoil/state-effects/StateEffectRoot';
import { RecoilStateFamily } from '@/lib/recoil/types';

import { ViewType, viewState } from '@/state/view';

import { BuildingDensityControl } from './sections/buildings/BuildingDensityControl';
import {
  CoastalControl,
  CycloneControl,
  DroughtControl,
  EarthquakeControl,
  ExtremeHeatControl,
  FluvialControl,
} from './sections/hazards/HazardsControl';
import { IndustryControl } from './sections/industry/IndustryControl';
import { NetworkControl } from './sections/networks/NetworkControl';
import { InfrastructureRiskSection } from './sections/risk/infrastructure-risk';
import { PopulationExposureSection } from './sections/risk/population-exposure';
import { RegionalRiskSection } from './sections/risk/regional-risk';
import { HdiControl } from './sections/vulnerability/HdiControl';
import { TravelTimeControl } from './sections/vulnerability/TravelTimeControl';
import { WdpaControls } from './sections/vulnerability/WdpaControl';
import { DataNotice } from './ui/DataNotice';

const viewLabels = {
  hazard: 'Hazard',
  exposure: 'Exposure',
  vulnerability: 'Vulnerability',
  risk: 'Risk',
};

export const sidebarVisibilityToggleState = atomFamily({
  key: 'sidebarVisibilityToggleState',
  default: false,
});

export const sidebarExpandedState = atomFamily({
  key: 'sidebarExpandedState',
  default: false,
});

export const sidebarPathChildrenState = atomFamily({
  key: 'sidebarPathChildrenState',
  default: () => [],
});

export const sidebarPathVisibilityState: RecoilStateFamily<boolean, string> = selectorFamily<
  boolean,
  string
>({
  key: 'sidebarPathVisibilityState',
  get:
    (path: string) =>
    ({ get }) => {
      const parentPath = getParentPath(path);

      return (
        (parentPath === '' || get(sidebarPathVisibilityState(parentPath))) &&
        get(sidebarVisibilityToggleState(path))
      );
    },
  set:
    (path: string) =>
    ({ get, set }, newVisibility) => {
      if (newVisibility) {
        set(sidebarVisibilityToggleState(path), true);
        const parentPath = getParentPath(path);
        if (parentPath !== '' && get(sidebarPathVisibilityState(parentPath)) === false) {
          set(sidebarPathVisibilityState(parentPath), true);
        }
      } else {
        set(sidebarVisibilityToggleState(path), false);
      }
    },
});

const HazardsSection = () => (
  <Section path="hazards" title="Hazards">
    <Layer path="fluvial" title="River Flooding">
      <FluvialControl />
    </Layer>
    <Layer path="coastal" title="Coastal Flooding">
      <CoastalControl />
    </Layer>
    <Layer path="cyclone" title="Tropical Cyclones">
      <CycloneControl />
    </Layer>
    <Layer path="extreme_heat" title="Extreme Heat">
      <ExtremeHeatControl />
    </Layer>
    <Layer path="drought" title="Droughts">
      <DroughtControl />
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
        Map shows population density in 2020, from the JRC Global Human Settlement Layer (2022).
      </DataNotice>
    </Layer>
    <Layer path="buildings" title="Buildings">
      <DataNotice>
        Map shows density of built-up surface in 2020, from the JRC Global Human Settlement Layer
        (2022).
      </DataNotice>
      <BuildingDensityControl />
    </Layer>
    <Layer path="infrastructure" title="Infrastructure">
      <DataNotice>
        Map shows infrastructure networks: road and rail derived from OpenStreetMap, power from
        Gridfinder, Arderne et al (2020).
      </DataNotice>
      <NetworkControl />
    </Layer>
    <Layer path="industry" title="Industry">
      <DataNotice>
        Map shows global databases of cement, iron and steel production assets, from the Spatial
        Finance Initiative, McCarten et al (2021).
      </DataNotice>
      <IndustryControl />
    </Layer>
    <Layer path="healthsites" title="Healthcare">
      <DataNotice>
        Map shows locations of healthcare facilities from the healthsites.io project, containing
        data extracted from OpenStreetMap.
      </DataNotice>
    </Layer>
    <Layer path="land-cover" title="Land Cover">
      <DataNotice>
        Map shows land cover classification gridded maps from the European Space Agency Climate
        Change Initiative Land Cover project (2021).
      </DataNotice>
    </Layer>
    <Layer path="organic-carbon" title="Soil Organic Carbon">
      <DataNotice>
        Map shows soil organic carbon content at 0-30cm, in tonnes/hectare, aggregated to a 1000m
        grid, from SoilGrids 2.0, Poggio et al (2021).
      </DataNotice>
    </Layer>
  </Section>
);

const VulnerabilitySection = () => (
  <Section path="vulnerability" title="Vulnerability">
    <Section path="human" title="People">
      <Layer path="human-development" title="Human Development">
        <HdiControl />
      </Layer>
      <Layer path="travel-time" title="Travel Time to Healthcare">
        <TravelTimeControl />
      </Layer>
    </Section>
    <Section path="nature" title="Planet">
      <Layer path="biodiversity-intactness" title="Biodiversity Intactness" />
      <Layer path="forest-integrity" title="Forest Landscape Integrity" />
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

// const VIEW_SECTIONS: Record<ViewType, ComponentType> = {
//   hazard: HazardsSection,
//   exposure: ExposureSection,
//   vulnerability: VulnerabilitySection,
//   risk: RiskSection,
// };

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

const viewTransitionEffect = ({ set }, newView) => {
  const { showPaths = [], hideRest = false } = VIEW_TRANSITIONS[newView].enter;

  for (const path of showPaths) {
    set(sidebarExpandedState(path), true);
    set(sidebarVisibilityToggleState(path), true);
  }

  if (hideRest) {
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
    >
      <StateEffectRoot state={viewState} effect={viewTransitionEffect} />
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
