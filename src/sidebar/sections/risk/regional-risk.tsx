import { atom, useAtom } from 'jotai';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';

import {
  REGIONAL_EXPOSURE_VARIABLE_LABELS,
  RegionalExposureVariableType,
} from '@/config/regional-risk/metadata';
import { InputSection } from '@/sidebar/ui/InputSection';

export const regionalExposureVariableAtom = atom<RegionalExposureVariableType>(
  'pop_exposed_seismic_threshold0.1g',
);

export const RegionalRiskSection = () => {
  const [rexpVariable, setRexpVariable] = useAtom(regionalExposureVariableAtom);

  return (
    <>
      <InputSection>
        <ParamDropdown<RegionalExposureVariableType>
          title="Population exposed to:"
          value={rexpVariable}
          onChange={setRexpVariable}
          options={REGIONAL_EXPOSURE_VARIABLE_LABELS}
        />
      </InputSection>
    </>
  );
};
