import { useRecoilState } from 'recoil';

import { ParamChecklist } from '@/lib/controls/params/ParamChecklist';

import { INDUSTRY_METADATA } from '@/config/industry/industry-view-layer';
import { LayerLabel } from '@/sidebar/ui/LayerLabel';
import { industrySelectionState, IndustryType } from '@/state/data-selection/industry';

export const IndustryControl = () => {
  const [checkboxState, setCheckboxState] = useRecoilState(industrySelectionState);

  return (
    <ParamChecklist<IndustryType>
      options={Object.keys(checkboxState) as IndustryType[]}
      checklistState={checkboxState}
      onChecklistState={setCheckboxState}
      renderLabel={(key) => {
        const { color, type, shortLabel } = INDUSTRY_METADATA[key];
        return <LayerLabel color={color} type={type} label={shortLabel} />;
      }}
      showAllNone={false}
    />
  );
};
