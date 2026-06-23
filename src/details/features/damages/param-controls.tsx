import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { atom, useAtom, useAtomValue } from 'jotai';

import { titleCase, unique } from '@/lib/helpers';
import { makeSelectAtom } from '@/lib/jotai/make-state/make-select-atom';

import { HAZARDS_METADATA } from '@/config/hazards/metadata';

import { damagesDataAtom } from './ExpectedDamagesSection';
import { selectedRpDataAtom } from './RPDamagesSection';

export const hazardsAtom = atom((get) => unique(get(damagesDataAtom).map((d) => d.hazard)));
export const selectedHazardAtom = makeSelectAtom(hazardsAtom);

export const HazardSelect = () => {
  const hazards = useAtomValue(hazardsAtom);
  const [selectedHazard, setSelectedHazard] = useAtom(selectedHazardAtom);

  return hazards.length ? (
    <FormControl fullWidth sx={{ my: 2 }} disabled={hazards.length === 1}>
      <InputLabel>Hazard</InputLabel>
      <Select
        label="Hazard"
        value={selectedHazard ?? ''}
        onChange={(e) => setSelectedHazard(e.target.value as string)}
      >
        {hazards.map((h) => (
          <MenuItem key={h} value={h}>
            {HAZARDS_METADATA[h]?.label ?? titleCase(h)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : null;
};

export const epochsAtom = atom((get) => unique(get(damagesDataAtom).map((d) => d.epoch)).sort());
export const selectedEpochAtom = makeSelectAtom(epochsAtom);

export const EpochSelect = () => {
  const epochs = useAtomValue(epochsAtom);
  const [selectedEpoch, setSelectedEpoch] = useAtom(selectedEpochAtom);

  return epochs.length ? (
    <FormControl fullWidth disabled={epochs.length === 1}>
      <InputLabel>Epoch</InputLabel>
      <Select
        label="Epoch"
        value={selectedEpoch ?? ''}
        onChange={(e) => setSelectedEpoch(e.target.value as string)}
      >
        {epochs.map((h) => (
          <MenuItem key={h} value={h}>
            {titleCase(h)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : null;
};

export const SHOW_ALL_OPTION = 'Show All';

const rpOptionsAtom = atom((get) => {
  const selectedRpData = get(selectedRpDataAtom);

  return selectedRpData
    ? [
        SHOW_ALL_OPTION,
        ...unique(
          selectedRpData
            .map((row) => row.rp)
            .sort((a, b) => a - b)
            .map(String),
        ),
      ]
    : [];
});

export const selectedRpOptionAtom = makeSelectAtom(rpOptionsAtom);

export const ReturnPeriodSelect = () => {
  const rpOptions = useAtomValue(rpOptionsAtom);
  const [selectedRpOption, setSelectedRpOption] = useAtom(selectedRpOptionAtom);

  return rpOptions.length ? (
    <FormControl fullWidth disabled={rpOptions.length < 2}>
      <InputLabel>Return Period</InputLabel>
      <Select
        label="Return Period"
        value={selectedRpOption ?? SHOW_ALL_OPTION}
        onChange={(e) => setSelectedRpOption(e.target.value as string)}
      >
        {rpOptions.map((rpOption) => (
          <MenuItem key={rpOption} value={rpOption}>
            {titleCase(rpOption)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : null;
};
