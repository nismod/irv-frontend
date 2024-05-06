import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';

import { topographySelectionState, TopographyType } from '@/state/data-selection/topography';

export const TopographyControl = () => {
  const [radioState, setRadioState] = useRecoilState(topographySelectionState);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioValue = (event.target as HTMLInputElement).value;
    setRadioState(radioValue === 'elevation' ? TopographyType.elevation : TopographyType.slope);
  };

  return (
    <RadioGroup
      aria-labelledby="demo-radio-buttons-group-label"
      defaultValue="female"
      name="radio-buttons-group"
      onChange={handleRadioChange}
      value={radioState === TopographyType.elevation ? 'elevation' : 'slope'}
    >
      <FormControlLabel value="slope" control={<Radio />} label="Slope" />
      <FormControlLabel value="elevation" control={<Radio />} label="Elevation" />
    </RadioGroup>
  );
};
