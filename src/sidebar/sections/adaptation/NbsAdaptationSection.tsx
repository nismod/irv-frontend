import { useRecoilState } from 'recoil';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { selectionState } from '@/lib/data-map/interactions/interaction-state';

import {
  ADAPTATION_VARIABLE_LABELS,
  AdaptationVariable,
  NBS_ADAPTATION_TYPE_LABELS,
  NBS_HAZARD_LABELS,
  NBS_REGION_SCOPE_LEVEL_LABELS,
  NbsAdaptationType,
  NbsHazardType,
  NbsRegionScopeLevel,
} from '@/config/nbs/metadata';
import { DataNotice, DataNoticeTextBlock } from '@/sidebar/ui/DataNotice';
import { InputSection } from '@/sidebar/ui/InputSection';
import {
  nbsAdaptationHazardState,
  nbsAdaptationTypeState,
  nbsRegionScopeLevelState,
  nbsVariableState,
} from '@/state/data-selection/nbs';

export const NbsAdaptationSection = () => {
  const [adaptationType, setAdaptationType] = useRecoilState(nbsAdaptationTypeState);
  const [scopeLevel, setScopeLevel] = useRecoilState(nbsRegionScopeLevelState);
  const [colorBy, setColorBy] = useRecoilState(nbsVariableState);
  const [hazard, setHazard] = useRecoilState(nbsAdaptationHazardState);
  const [, setScopeRegionSelection] = useRecoilState(selectionState('scope_regions'));

  const handleScopeLevelChange = (newScopeLevel: NbsRegionScopeLevel) => {
    setScopeLevel(newScopeLevel);
    setScopeRegionSelection(null);
  };

  return (
    <>
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows the avoided damages for Nature-Based Solutions adaptation options
        </DataNoticeTextBlock>
      </DataNotice>
      <InputSection>
        <ParamDropdown<NbsAdaptationType>
          title="Adaptation type:"
          value={adaptationType}
          onChange={setAdaptationType}
          options={NBS_ADAPTATION_TYPE_LABELS}
        />
      </InputSection>
      <InputSection>
        <ParamDropdown<NbsRegionScopeLevel>
          title="Geographic scope:"
          value={scopeLevel}
          onChange={handleScopeLevelChange}
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
