import { Autocomplete, TextField } from '@mui/material';
import { BoundarySummary } from '@nismod/irv-autopkg-client';

export const RegionSearch = ({
  regions,
  selectedRegion,
  onSelectedRegion,
}: {
  regions: BoundarySummary[];
  selectedRegion: BoundarySummary;
  onSelectedRegion: (x: BoundarySummary) => void;
}) => {
  return (
    <Autocomplete<BoundarySummary>
      value={selectedRegion}
      onChange={(e, v) => onSelectedRegion(v)}
      options={regions}
      getOptionLabel={(o) => o.name_long}
      renderInput={(params) => <TextField {...params} label="Select country" />}
      disablePortal
      autoHighlight
      clearOnEscape
    />
  );
};
