import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';
import { useRecoilState } from 'recoil';

import { topographySelectionState } from '@/state/data-selection/topography';

export const TopographyControl = () => {
  const [radioState, setRadioState] = useRecoilState(topographySelectionState);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioValue = (event.target as HTMLInputElement).value;
    setRadioState(radioValue === 'elevation' ? 'elevation' : 'slope');
  };

  return (
    <RadioGroup
      aria-labelledby="demo-radio-buttons-group-label"
      defaultValue="female"
      name="radio-buttons-group"
      onChange={handleRadioChange}
      value={radioState === 'elevation' ? 'elevation' : 'slope'}
    >
      <FormControlLabel value="elevation" control={<Radio />} label="Elevation" />
      <FormControlLabel value="slope" control={<Radio />} label="Slope" />
    </RadioGroup>
  );
};
