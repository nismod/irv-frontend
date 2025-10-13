import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { BoundarySummary } from '@nismod/irv-autopkg-client';
import { ReactElement } from 'react';

export const RegionSearch = ({
  regions,
  selectedRegion,
  onSelectedRegion,
  title,
  icon,
}: {
  regions: BoundarySummary[];
  selectedRegion: BoundarySummary;
  onSelectedRegion: (x: BoundarySummary) => void;
  title: string;
  icon?: ReactElement;
}) => {
  return (
    <Autocomplete<BoundarySummary>
      sx={{ minWidth: '200px', width: '400px', maxWidth: '100%' }}
      value={selectedRegion}
      onChange={(e, v) => onSelectedRegion(v)}
      options={regions}
      getOptionLabel={(o) => o.name_long}
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: icon ? (
              <InputAdornment position="end">{icon}</InputAdornment>
            ) : (
              params.InputProps.endAdornment
            ),
          }}
        />
      )}
      disablePortal
      autoHighlight
      clearOnEscape
    />
  );
};
