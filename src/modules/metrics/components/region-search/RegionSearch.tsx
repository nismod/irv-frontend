import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { ReactElement } from 'react';

import type { CountryOption } from '../../types/CountryOption';

export const RegionSearch = ({
  regions,
  selectedRegion,
  onSelectedRegion,
  title,
  icon,
}: {
  regions: CountryOption[];
  selectedRegion: CountryOption;
  onSelectedRegion: (x: CountryOption) => void;
  title: string;
  icon?: ReactElement;
}) => {
  return (
    // TODO generic type
    <Autocomplete<any>
      sx={{
        width: '100%',
        maxWidth: '400px',
      }}
      value={selectedRegion}
      onChange={(_, value) => onSelectedRegion(value)}
      options={regions}
      getOptionLabel={(option) => option.label}
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
