import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';

import { useDataGroup } from '@/lib/data-selection/DataGroup';
import { useInputDisabled } from '@/lib/data-selection/DisabledInput';

import { DataParam } from '../DataParam';

const gcmLabelLookup = {
  'EC-EARTH3P-HR': 'EC-Earth3P-HR',
  'HADGEM2-ES': 'HadGEM2-ES',
  'HADGEM3-GC31-HM': 'HadGEM3-GC31-HM',
  'NORESM1-M': 'NorESM1-M',
  CONSTANT: 'None (Baseline)',
};

function gcmLabel(value: string) {
  const upper = value.toUpperCase();
  return gcmLabelLookup[upper] ?? upper;
}

export const GCMControl = () => {
  const group = useDataGroup();
  const disabled = useInputDisabled();

  return (
    <FormControl fullWidth disabled={disabled}>
      <FormLabel>
        <abbr title="General Circulation Model">GCM</abbr>
      </FormLabel>
      <DataParam group={group} id="gcm">
        {({ value, onChange, options }) => (
          <Select
            variant="standard"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
          >
            {options.map((epoch) => (
              <MenuItem key={epoch} value={epoch}>
                {gcmLabel(epoch)}
              </MenuItem>
            ))}
          </Select>
        )}
      </DataParam>
    </FormControl>
  );
};
