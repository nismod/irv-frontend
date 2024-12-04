import { useRecoilState } from 'recoil';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';

import {
  ADAPTATION_VARIABLE_LABELS,
  AdaptationVariable,
  NBS_HAZARD_LABELS,
  NBS_REGION_SCOPE_LEVEL_LABELS,
  NbsHazardType,
  NbsRegionScopeLevel,
} from '@/config/nbs/metadata';
import { DataNotice, DataNoticeTextBlock } from '@/sidebar/ui/DataNotice';
import { InputSection } from '@/sidebar/ui/InputSection';
import {
  nbsAdaptationHazardState,
  nbsRegionScopeLevelState,
  nbsVariableState,
} from '@/state/data-selection/nbs';

export const NbsAdaptationSection = () => {
  const [scopeLevel, setScopeLevel] = useRecoilState(nbsRegionScopeLevelState);
  const [colorBy, setColorBy] = useRecoilState(nbsVariableState);
  const [hazard, setHazard] = useRecoilState(nbsAdaptationHazardState);
  return (
    <>
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows the avoided damages for Nature-Based Solutions adaptation options
        </DataNoticeTextBlock>
      </DataNotice>
      <InputSection>
        <ParamDropdown<NbsRegionScopeLevel>
          title="Geographic scope:"
          value={scopeLevel}
          onChange={setScopeLevel}
          options={NBS_REGION_SCOPE_LEVEL_LABELS}
        />
      </InputSection>
      <InputSection>
        <ParamDropdown<AdaptationVariable>
          title="Color by:"
          value={colorBy}
          onChange={setColorBy}
          options={ADAPTATION_VARIABLE_LABELS}
        />
      </InputSection>
      <InputSection>
        <ParamDropdown<NbsHazardType>
          title="Hazard:"
          value={hazard}
          onChange={setHazard}
          options={NBS_HAZARD_LABELS}
        />
      </InputSection>
    </>
  );
};
