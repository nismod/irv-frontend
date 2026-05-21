import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useRecoilState, useRecoilTransaction_UNSTABLE, useRecoilValue } from 'recoil';

import { DataGroup } from '@/lib/data-selection/DataGroup';
import { useSyncValueToAtom } from '@/lib/jotai/state-sync/use-sync-state';

import { ExposureSource } from '@/config/hazards/exposure/exposure-view-layer';
import { getHazardSidebarPath } from '@/config/hazards/metadata';
import { sidebarPathVisibilityState, sidebarVisibilityToggleState } from '@/sidebar/SidebarContent';
import { DataNotice, DataNoticeTextBlock } from '@/sidebar/ui/DataNotice';
import { InputRow } from '@/sidebar/ui/InputRow';
import { InputSection } from '@/sidebar/ui/InputSection';
import { EpochControl } from '@/sidebar/ui/params/EpochControl';
import { RCPControl } from '@/sidebar/ui/params/RCPControl';
import { dataParamsByGroupState } from '@/state/data-params';
import { showOneHazardStateEffect } from '@/state/data-selection/hazards';

import { hideExposure, syncExposure } from './exposure-sidebar-sync';

export const populationExposureHazardAtom = atom<ExposureSource>('extreme_heat');

/**
 * Recoil↔Jotai migration: param values still live in Recoil `dataParamsByGroupState` (Slice 14).
 * Synced here so `populationExposureLayerAtom` can read them without touching Recoil in atom get().
 */
export const populationExposureGroupParamsReplicaAtom = atom<Record<string, unknown>>({});

const InitPopulationView = () => {
  const updateExposureTx = useRecoilTransaction_UNSTABLE(
    (iface) => () => syncExposure(iface, 'population'),
    [],
  );
  const hideExposureTx = useRecoilTransaction_UNSTABLE(
    (iface) => () => hideExposure(iface, 'population'),
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

function PopulationExposureGroupParamsSync() {
  const hazard = useAtomValue(populationExposureHazardAtom);
  const groupParams = useRecoilValue(dataParamsByGroupState(hazard));
  useSyncValueToAtom(groupParams, populationExposureGroupParamsReplicaAtom);
  return null;
}

/** Recoil↔Jotai migration: hazard atom is Jotai; hazard sidebar toggles are still Recoil (Slice 13). */
function SyncPopulationHazardToSidebar() {
  const hazard = useAtomValue(populationExposureHazardAtom);
  const applyHazardEffect = useRecoilTransaction_UNSTABLE(
    (iface) => (newHazard: ExposureSource) =>
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

export const PopulationExposureSection = () => {
  const [hazard, setHazard] = useAtom(populationExposureHazardAtom);

  const [showHazards, setShowHazards] = useRecoilState(
    sidebarPathVisibilityState(getHazardSidebarPath(hazard)),
  );
  const [showPopulation, setShowPopulation] = useRecoilState(
    sidebarPathVisibilityState('exposure/population'),
  );

  return (
    <>
      <InitPopulationView />
      <PopulationExposureGroupParamsSync />
      <SyncPopulationHazardToSidebar />
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows expected annual population exposed to extreme events, based on the annual
          probability of the hazard. These are combined temperature and humidity indices for extreme
          heat, and soil moisture below the 2.5th percentile of a pre-industrial baseline for land
          exposed to drought. See hazard notes and about/data sources pages for references and more
          detail.
        </DataNoticeTextBlock>
      </DataNotice>
      <InputSection>
        <FormControl>
          <FormLabel>Hazard</FormLabel>
          <RadioGroup value={hazard} onChange={(e, value) => setHazard(value as ExposureSource)}>
            <FormControlLabel value="extreme_heat" control={<Radio />} label="Extreme Heat" />
            <FormControlLabel value="drought" control={<Radio />} label="Droughts" />
          </RadioGroup>
        </FormControl>
      </InputSection>
      <InputSection>
        <DataGroup group={hazard}>
          <InputRow>
            <EpochControl />
            <RCPControl />
          </InputRow>
        </DataGroup>
      </InputSection>
      <InputSection>
        <FormControlLabel
          control={<Switch />}
          checked={showHazards}
          onChange={(e, checked) => setShowHazards(checked)}
          label="Hazard layer"
        />
      </InputSection>
      <InputSection>
        <FormControlLabel
          control={<Switch />}
          checked={showPopulation}
          onChange={(e, checked) => setShowPopulation(checked)}
          label="Population layer"
        />
      </InputSection>
    </>
  );
};
