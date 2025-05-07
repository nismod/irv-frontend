import { FormControlLabel, Switch } from '@mui/material';
import _ from 'lodash';
import { Suspense, useEffect } from 'react';
import { atom, useRecoilState, useRecoilTransaction_UNSTABLE, useRecoilValue } from 'recoil';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { DataGroup } from '@/lib/data-selection/DataGroup';
import { makeOptions } from '@/lib/helpers';
import { StateEffectRoot } from '@/lib/recoil/state-effects/StateEffectRoot';
import { StateEffect } from '@/lib/recoil/state-effects/types';

import { HAZARDS_METADATA, HazardType } from '@/config/hazards/metadata';
import { NetworkLayerType } from '@/config/networks/metadata';
import { LinkViewLayerToPath } from '@/sidebar/LinkViewLayerToPath';
import { DataNotice, DataNoticeTextBlock } from '@/sidebar/ui/DataNotice';
import { DataParam } from '@/sidebar/ui/DataParam';
import { InputRow } from '@/sidebar/ui/InputRow';
import { InputSection } from '@/sidebar/ui/InputSection';
import { EpochControl } from '@/sidebar/ui/params/EpochControl';
import { RCPControl } from '@/sidebar/ui/params/RCPControl';
import { paramValueState, useLoadParamsConfig } from '@/state/data-params';
import {
  damageSourceState,
  showInfrastructureRiskState,
  syncHazardsWithDamageSourceStateEffect,
} from '@/state/data-selection/damage-mapping/damage-map';
import { hazardSelectionState } from '@/state/data-selection/hazards';
import { syncInfrastructureSelectionStateEffect } from '@/state/data-selection/networks/network-selection';

import { hideExposure, syncExposure } from './population-exposure';

type SectorType = 'roads' | 'rail' | 'power';

const infrastructureRiskConfig = atom({
  key: 'infrastructureRiskConfig',
  default: {
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

const syncInfrastructureWithSectorEffect: StateEffect<SectorType> = (iface, sector) => {
  const layers = SECTOR_LAYERS[sector];

  syncInfrastructureSelectionStateEffect(iface, layers);
};

const syncHazardEffect: StateEffect<HazardType> = (iface, hazard) => {
  syncHazardsWithDamageSourceStateEffect(iface, hazard);

  iface.set(damageSourceState, hazard);
};

function labelHazard(x) {
  return HAZARDS_METADATA[x].label;
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

export const InfrastructureRiskSection = () => {
  useLoadParamsConfig(infrastructureRiskConfig, 'infrastructure-risk');
  const damageSource = useRecoilValue(damageSourceState);

  const [showHazard, setShowHazard] = useRecoilState(hazardSelectionState(damageSource));

  return (
    // the top-level Suspense prevents deadlock between the `useLoadParamConfig()` and components that use the state that hook loads
    // both the hook and the components suspend, and in React 18 concurrent mode, this makes React suspend the tree indefinitely
    <Suspense fallback="Loading data...">
      <LinkViewLayerToPath state={showInfrastructureRiskState} />
      <InitInfrastructureView />
      <InputSection>
        <StateEffectRoot
          state={paramValueState({ group: 'infrastructure-risk', param: 'sector' })}
          effect={syncInfrastructureWithSectorEffect}
        />
        <StateEffectRoot
          state={paramValueState({ group: 'infrastructure-risk', param: 'hazard' })}
          effect={syncHazardEffect}
        />
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
