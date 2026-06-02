import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { useAtomCallback } from 'jotai/utils';
import _ from 'lodash';
import { Suspense, useCallback, useEffect } from 'react';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { DataGroup } from '@/lib/data-selection/DataGroup';
import { makeOptions } from '@/lib/helpers';
import { AtomEffectRoot } from '@/lib/jotai/effects/AtomEffectRoot';

import { getHazardSidebarPath, HAZARDS_METADATA, HazardType } from '@/config/hazards/metadata';
import { NetworkLayerType } from '@/config/networks/metadata';
import { LinkViewLayerToPath } from '@/sidebar/LinkViewLayerToPath';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { DataNotice, DataNoticeTextBlock } from '@/sidebar/ui/DataNotice';
import { DataParam } from '@/sidebar/ui/DataParam';
import { InputRow } from '@/sidebar/ui/InputRow';
import { InputSection } from '@/sidebar/ui/InputSection';
import { EpochControl } from '@/sidebar/ui/params/EpochControl';
import { RCPControl } from '@/sidebar/ui/params/RCPControl';
import { paramValueAtomFamily, useLoadParamsConfig } from '@/state/data-params';
import {
  damageSourceAtom,
  showInfrastructureRiskAtom,
} from '@/state/data-selection/damage-mapping/damage-map';
import { syncInfrastructureSelectionStateEffect } from '@/state/data-selection/networks/network-selection';

import { hideExposure, syncExposure, syncHazardSidebar } from './risk-sidebar-sync';

type SectorType = 'roads' | 'rail' | 'power';

const infrastructureRiskConfigAtom = atom({
  paramDomains: {
    sector: ['roads', 'rail', 'power'],
    hazard: ['fluvial', 'cyclone'],
  },
  paramDefaults: {
    sector: 'roads',
    hazard: 'fluvial',
  },
  paramDependencies: {
    hazard: ({ sector }) => {
      if (sector === 'roads') return ['fluvial'];
      if (sector === 'rail') return ['fluvial'];
      if (sector === 'power') return ['cyclone'];
    },
  },
});

const SECTOR_LAYERS: Record<SectorType, NetworkLayerType[]> = {
  roads: [
    'road_edges_motorway',
    'road_edges_trunk',
    'road_edges_primary',
    'road_edges_secondary',
    'road_edges_tertiary',
  ],
  rail: ['rail_edges', 'rail_nodes'],
  power: ['power_distribution', 'power_transmission'],
};

const infrastructureSectorParam = { group: 'infrastructure-risk', param: 'sector' } as const;
const infrastructureHazardParam = { group: 'infrastructure-risk', param: 'hazard' } as const;

const syncSectorToNetworkTreeEffectAtom = atomEffect((get, set) => {
  const sector = get(paramValueAtomFamily(infrastructureSectorParam)) as SectorType;
  syncInfrastructureSelectionStateEffect({ get, set }, SECTOR_LAYERS[sector]);
});

const syncInfrastructureHazardToSidebarEffectAtom = atomEffect((get, set) => {
  const hazard = get(paramValueAtomFamily(infrastructureHazardParam)) as HazardType;
  syncHazardSidebar({ get, set }, getHazardSidebarPath(hazard));
});

const syncHazardToDamageSourceEffectAtom = atomEffect((get, set) => {
  set(damageSourceAtom, get(paramValueAtomFamily(infrastructureHazardParam)) as HazardType);
});

const InitInfrastructureView = () => {
  const updateExposureFn = useAtomCallback(
    useCallback((get, set) => syncExposure({ get, set }, 'infrastructure'), []),
  );
  const hideExposureFn = useAtomCallback(
    useCallback((get, set) => hideExposure({ get, set }, 'infrastructure'), []),
  );

  useEffect(() => {
    updateExposureFn();

    return () => {
      hideExposureFn();
    };
  }, [updateExposureFn, hideExposureFn]);

  return null;
};

function labelHazard(x) {
  return HAZARDS_METADATA[x].label;
}

export const InfrastructureRiskSection = () => {
  useLoadParamsConfig(infrastructureRiskConfigAtom, 'infrastructure-risk');
  const damageSource = useAtomValue(damageSourceAtom);

  const [showHazard, setShowHazard] = useAtom(
    sidebarPathVisibilityAtomFamily(getHazardSidebarPath(damageSource)),
  );

  return (
    // the top-level Suspense prevents deadlock between the `useLoadParamConfig()` and components that use the state that hook loads
    // both the hook and the components suspend, and in React 18 concurrent mode, this makes React suspend the tree indefinitely
    <Suspense fallback="Loading data...">
      <LinkViewLayerToPath atom={showInfrastructureRiskAtom} resetOnUnmount />
      <InitInfrastructureView />
      <AtomEffectRoot effectAtom={syncSectorToNetworkTreeEffectAtom} />
      <AtomEffectRoot effectAtom={syncHazardToDamageSourceEffectAtom} />
      <AtomEffectRoot effectAtom={syncInfrastructureHazardToSidebarEffectAtom} />
      <InputSection>
        <DataNotice>
          <DataNoticeTextBlock>
            Power sector assets (transmission lines) are assumed to be vulnerable to high wind
            speeds but not flooding. Road and rail assets are assumed to be vulnerable to flooding
            but not wind.
          </DataNoticeTextBlock>
        </DataNotice>
        <InputRow>
          <DataParam group="infrastructure-risk" id="sector">
            {({ value, onChange, options }) => (
              <ParamDropdown
                title="Sector"
                value={value}
                onChange={onChange}
                options={makeOptions(options, _.startCase)}
              />
            )}
          </DataParam>
          <DataParam group="infrastructure-risk" id="hazard">
            {({ value, onChange, options }) => (
              <ParamDropdown
                title="Hazard"
                value={value}
                onChange={onChange}
                options={makeOptions(options, labelHazard)}
              />
            )}
          </DataParam>
        </InputRow>
      </InputSection>
      <InputSection>
        <InputRow>
          <DataGroup group={damageSource}>
            <EpochControl />
            <RCPControl />
          </DataGroup>
        </InputRow>
      </InputSection>
      <InputSection>
        <FormControlLabel
          control={<Switch />}
          checked={showHazard}
          onChange={(e, checked) => setShowHazard(checked)}
          label="Hazard layer"
        />
      </InputSection>
    </Suspense>
  );
};
