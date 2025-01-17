import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { selectionState } from '@/lib/data-map/interactions/interaction-state';
import { makeOptions } from '@/lib/helpers';

import {
  NBS_ADAPTATION_TYPE_LABELS,
  NBS_DATA_VARIABLE_METADATA,
  NBS_DATA_VARIABLES_PER_ADAPTATION_TYPE,
  NBS_HAZARD_METADATA,
  NBS_HAZARDS_PER_ADAPTATION_TYPE,
  NBS_REGION_SCOPE_LEVEL_LABELS,
  NbsAdaptationType,
  NbsDataVariable,
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
  const [, setScopeRegionSelection] = useRecoilState(selectionState('scope_regions'));

  const handleScopeLevelChange = (newScopeLevel: NbsRegionScopeLevel) => {
    setScopeLevel(newScopeLevel);
    setScopeRegionSelection(null);
  };

  const { showHazard } = NBS_DATA_VARIABLE_METADATA[colorBy];

  const colorByOptions = useDataVariableOptions(adaptationType);

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
        <ParamDropdown<NbsDataVariable>
          title="Color by:"
          value={colorBy}
          onChange={setColorBy}
          options={colorByOptions}
        />
      </InputSection>
      <AdaptationHazardSection showHazard={showHazard} />
    </>
  );
};

function useDataVariableOptions(adaptationType: NbsAdaptationType) {
  const dataVariables = NBS_DATA_VARIABLES_PER_ADAPTATION_TYPE[adaptationType];
  return makeOptions(dataVariables, (x) => NBS_DATA_VARIABLE_METADATA[x].label);
}

function AdaptationHazardSection({ showHazard }) {
  const adaptationType = useRecoilValue(nbsAdaptationTypeState);
  const [hazard, setHazard] = useRecoilState(nbsAdaptationHazardState);

  const hazards = NBS_HAZARDS_PER_ADAPTATION_TYPE[adaptationType];

  const hazardOptions = useMemo(() => {
    return makeOptions(hazards, (x) => NBS_HAZARD_METADATA[x].label);
  }, [hazards]);

  return (
    <InputSection sx={{ visibility: showHazard ? 'visible' : 'hidden' }}>
      <ParamDropdown<NbsHazardType>
        title="Hazard:"
        value={hazard}
        onChange={setHazard}
        options={hazardOptions}
        disabled={!showHazard}
      />
    </InputSection>
  );
}
