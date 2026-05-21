import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import _ from 'lodash';
import { Suspense, useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilTransaction_UNSTABLE, useRecoilValue } from 'recoil';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { DataGroup } from '@/lib/data-selection/DataGroup';
import { makeOptions } from '@/lib/helpers';
import { useSyncValueToAtom } from '@/lib/jotai/state-sync/use-sync-state';

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
import { dataParamsByGroupState, paramValueState, useLoadParamsConfig } from '@/state/data-params';
import {
  damageSourceAtom,
  showInfrastructureRiskAtom,
} from '@/state/data-selection/damage-mapping/damage-map';
import { damageGroupParamsReplicaAtom } from '@/state/data-selection/damage-mapping/damage-style-params';
import { showOneHazardStateEffect } from '@/state/data-selection/hazards';
import { syncInfrastructureSelectionStateEffect } from '@/state/data-selection/networks/network-selection';

import { hideExposure, syncExposure } from './exposure-sidebar-sync';

type SectorType = 'roads' | 'rail' | 'power';

// Recoil↔Jotai migration: static config lives in Jotai; param values and sidebar state stay on Recoil.
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
  const hazard = useRecoilValue(
    paramValueState({ group: 'infrastructure-risk', param: 'hazard' }),
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

/**
 * Recoil↔Jotai migration: syncs active damage-source param values from Recoil into Jotai
 * so `damagesFieldAtom` can read them without touching `dataParamsByGroupState` in atom get().
 */
function DamageGroupParamsSync() {
  const damageSource = useAtomValue(damageSourceAtom);
  const groupParams = useRecoilValue(dataParamsByGroupState(damageSource));
  useSyncValueToAtom(groupParams, damageGroupParamsReplicaAtom);
  return null;
}

/** Recoil↔Jotai migration: sector param is still Recoil; network tree selection is Jotai. */
function SyncSectorToNetworkTree() {
  const sector = useRecoilValue(
    paramValueState({ group: 'infrastructure-risk', param: 'sector' }),
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

/** Recoil↔Jotai migration: hazard param is still Recoil; damage source atom is Jotai. */
function SyncHazardToDamageSource() {
  const hazard = useRecoilValue(
    paramValueState({ group: 'infrastructure-risk', param: 'hazard' }),
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
  // Recoil↔Jotai migration: useLoadParamsConfig writes Jotai paramsConfigAtomFamily + Recoil paramsState.
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
      <DamageGroupParamsSync />
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
