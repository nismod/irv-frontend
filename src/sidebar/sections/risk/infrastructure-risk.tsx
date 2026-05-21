import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import _ from 'lodash';
import { Suspense, useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilTransaction_UNSTABLE } from 'recoil';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { DataGroup } from '@/lib/data-selection/DataGroup';
import { makeOptions } from '@/lib/helpers';

import { getHazardSidebarPath, HAZARDS_METADATA, HazardType } from '@/config/hazards/metadata';
import { NetworkLayerType } from '@/config/networks/metadata';
import { LinkViewLayerToPath } from '@/sidebar/LinkViewLayerToPath';
import { sidebarPathVisibilityState, sidebarVisibilityToggleState } from '@/sidebar/SidebarContent';
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
import { showOneHazardStateEffect } from '@/state/data-selection/hazards';
import { syncInfrastructureSelectionStateEffect } from '@/state/data-selection/networks/network-selection';

import { hideExposure, syncExposure } from './exposure-sidebar-sync';

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

function SyncInfrastructureHazardToSidebar() {
  const hazard = useAtomValue(
    paramValueAtomFamily({ group: 'infrastructure-risk', param: 'hazard' }),
  ) as HazardType;
  const applyHazardEffect = useRecoilTransaction_UNSTABLE(
    (iface) => (newHazard: HazardType) =>
      showOneHazardStateEffect(
        (path, visible) => iface.set(sidebarVisibilityToggleState(path), visible),
        newHazard,
      ),
    [],
  );

  useEffect(() => {
    applyHazardEffect(hazard);
  }, [hazard, applyHazardEffect]);

  return null;
}

const InitInfrastructureView = () => {
  const updateExposureTx = useRecoilTransaction_UNSTABLE(
    (iface) => () => syncExposure(iface, 'infrastructure'),
    [],
  );
  const hideExposureTx = useRecoilTransaction_UNSTABLE(
    (iface) => () => hideExposure(iface, 'infrastructure'),
    [],
  );

  useEffect(() => {
    updateExposureTx();

    return () => {
      hideExposureTx();
    };
  }, [updateExposureTx, hideExposureTx]);

  return null;
};

/** When sector changes, reset the network tree to that sector's default layers. */
function SyncSectorToNetworkTree() {
  const sector = useAtomValue(
    paramValueAtomFamily({ group: 'infrastructure-risk', param: 'sector' }),
  ) as SectorType;

  const syncSector = useAtomCallback(
    useCallback((get, set, layers: NetworkLayerType[]) => {
      syncInfrastructureSelectionStateEffect({ get, set }, layers);
    }, []),
  );

  useEffect(() => {
    syncSector(SECTOR_LAYERS[sector]);
  }, [sector, syncSector]);

  return null;
}

/** Keep damageSourceAtom aligned with the hazard param (epoch/RCP group + damage styling). */
function SyncHazardToDamageSource() {
  const hazard = useAtomValue(
    paramValueAtomFamily({ group: 'infrastructure-risk', param: 'hazard' }),
  ) as HazardType;
  const setDamageSource = useSetAtom(damageSourceAtom);

  useEffect(() => {
    setDamageSource(hazard);
  }, [hazard, setDamageSource]);

  return null;
}

function labelHazard(x) {
  return HAZARDS_METADATA[x].label;
}

export const InfrastructureRiskSection = () => {
  useLoadParamsConfig(infrastructureRiskConfigAtom, 'infrastructure-risk');
  const damageSource = useAtomValue(damageSourceAtom);

  const [showHazard, setShowHazard] = useRecoilState(
    sidebarPathVisibilityState(getHazardSidebarPath(damageSource)),
  );

  return (
    // the top-level Suspense prevents deadlock between the `useLoadParamConfig()` and components that use the state that hook loads
    // both the hook and the components suspend, and in React 18 concurrent mode, this makes React suspend the tree indefinitely
    <Suspense fallback="Loading data...">
      <LinkViewLayerToPath atom={showInfrastructureRiskAtom} resetOnUnmount />
      <InitInfrastructureView />
      <SyncSectorToNetworkTree />
      <SyncHazardToDamageSource />
      <SyncInfrastructureHazardToSidebar />
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
