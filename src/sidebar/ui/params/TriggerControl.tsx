import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useDataGroup } from '@/lib/data-selection/DataGroup';
import { useInputDisabled } from '@/lib/data-selection/DisabledInput';
import { titleCase } from '@/lib/helpers';

import { DataParam } from '../DataParam';

export const TriggerControl = () => {
  const group = useDataGroup();
  const disabled = useInputDisabled();
  return (
    <FormControl fullWidth disabled={disabled}>
      <FormLabel>Trigger</FormLabel>
      <DataParam group={group} id="subtype">
        {({ value, onChange, options }) => (
          <Select
            variant="standard"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            fullWidth
          >
            {options.map((trigger) => (
              <MenuItem key={trigger} value={trigger}>
                {titleCase(trigger.replace('_', ' '))}
              </MenuItem>
            ))}
          </Select>
        )}
      </DataParam>
    </FormControl>
  );
};
