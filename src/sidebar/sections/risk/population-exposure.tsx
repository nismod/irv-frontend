import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import { atom, useAtom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { useAtomCallback } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { DataGroup } from '@/lib/data-selection/DataGroup';
import { AtomEffectRoot } from '@/lib/jotai/effects/AtomEffectRoot';

import { ExposureSource } from '@/config/hazards/exposure/exposure-view-layer';
import { getHazardSidebarPath } from '@/config/hazards/metadata';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { DataNotice, DataNoticeTextBlock } from '@/sidebar/ui/DataNotice';
import { InputRow } from '@/sidebar/ui/InputRow';
import { InputSection } from '@/sidebar/ui/InputSection';
import { EpochControl } from '@/sidebar/ui/params/EpochControl';
import { RCPControl } from '@/sidebar/ui/params/RCPControl';

import { hideExposure, syncExposure, syncHazardSidebar } from './risk-sidebar-sync';

export const populationExposureHazardAtom = atom<ExposureSource>('extreme_heat');

const syncPopulationHazardToSidebarEffectAtom = atomEffect((get, set) => {
  syncHazardSidebar({ get, set }, getHazardSidebarPath(get(populationExposureHazardAtom)));
});

const InitPopulationView = () => {
  const updateExposure = useAtomCallback(
    useCallback((get, set) => syncExposure({ get, set }, 'population'), []),
  );
  const hideExposureFn = useAtomCallback(
    useCallback((get, set) => hideExposure({ get, set }, 'population'), []),
  );

  useEffect(() => {
    updateExposure();

    return () => {
      hideExposureFn();
    };
  }, [updateExposure, hideExposureFn]);

  return null;
};

export const PopulationExposureSection = () => {
  const [hazard, setHazard] = useAtom(populationExposureHazardAtom);

  const [showHazards, setShowHazards] = useAtom(
    sidebarPathVisibilityAtomFamily(getHazardSidebarPath(hazard)),
  ) as [boolean, (value: boolean) => void];
  const [showPopulation, setShowPopulation] = useAtom(
    sidebarPathVisibilityAtomFamily('exposure/population'),
  ) as [boolean, (value: boolean) => void];

  return (
    <>
      <InitPopulationView />
      <AtomEffectRoot effectAtom={syncPopulationHazardToSidebarEffectAtom} />
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
