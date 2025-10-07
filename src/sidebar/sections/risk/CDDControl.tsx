import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';
import { useRecoilState } from 'recoil';

import { cddSelectionState } from '@/state/data-selection/cdd';

export const CDDControl = () => {
  const [radioState, setRadioState] = useRecoilState(cddSelectionState);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioValue = (event.target as HTMLInputElement).value;
    setRadioState(radioValue === 'relative' ? 'relative' : 'absolute');
  };

  return (
    <RadioGroup
      name="radio-buttons-group"
      onChange={handleRadioChange}
      value={radioState === 'relative' ? 'relative' : 'absolute'}
    >
      <FormControlLabel value="absolute" control={<Radio />} label="Absolute" />
      <FormControlLabel value="relative" control={<Radio />} label="Relative" />
    </RadioGroup>
  );
};
