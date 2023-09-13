import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';

import { useDataGroup } from '@/lib/data-selection/DataGroup';
import { DataParam } from '@/lib/data-selection/DataParam';
import { useInputDisabled } from '@/lib/data-selection/DisabledInput';

function sspLabel(ssp: string) {
  return ssp.toUpperCase();
}

export const SSPControl = () => {
  const group = useDataGroup();
  const disabled = useInputDisabled();

  return (
    <FormControl fullWidth disabled={disabled}>
      <FormLabel>
        <abbr title="Shared Socio-Economic Pathway">SSP</abbr>
      </FormLabel>
      <DataParam group={group} id="ssp">
        {({ value, onChange, options }) => (
          <Select
            variant="standard"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
          >
            {options.map((ssp) => (
              <MenuItem key={ssp} value={ssp}>
                {sspLabel(ssp)}
              </MenuItem>
            ))}
          </Select>
        )}
      </DataParam>
    </FormControl>
  );
};
