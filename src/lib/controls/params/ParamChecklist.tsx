import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import { ReactElement, useMemo } from 'react';

import { fromKeys } from '@/lib/helpers';

import { getValueLabel, ValueLabel } from './value-label';

interface ParamChecklistProps<K extends string> {
  /** Title of the control */
  title?: string;
  /** Array of checkbox items, supplied as either strings or `ValueLabel` objects */
  options: K[] | ValueLabel<K>[];
  /** Lookup (by ID/key of checkbox item) indicating checked/unchecked state */
  checklistState: { [key in K]: boolean };
  /** Handler called when the checklist state changes */
  onChecklistState: (state: { [key in K]: boolean }) => void;
  /** Function called for each item with string key and text label (if options are supplied as `ValueLabel`s), to render the option label in React */
  renderLabel: (key: K, label?: string) => ReactElement;
  /** Should buttons for selecting all/none should be shown? True by default. */
  showAllNone?: boolean;
}

/**
 * A UI component which displays a list of labelled checkboxes, and has additional controls for triggering selection of all/none of items.
 */
export const ParamChecklist = <K extends string = string>({
  title,
  checklistState,
  onChecklistState,
  renderLabel,
  options,
  showAllNone = true,
}: ParamChecklistProps<K>) => {
  const isAll = Object.values(checklistState).every((value) => value);
  const isNone = Object.values(checklistState).every((value) => !value);

  const valueLabels = useMemo(() => options.map(getValueLabel) as ValueLabel<K>[], [options]);
  const keys = valueLabels.map((valueLabel) => valueLabel.value) as K[];

  return (
    <FormGroup>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {title && <FormLabel>{title}</FormLabel>}
        {showAllNone && (
          <Box>
            <Button disabled={isAll} onClick={() => onChecklistState(fromKeys(keys, true))}>
              All
            </Button>
            <Button disabled={isNone} onClick={() => onChecklistState(fromKeys(keys, false))}>
              None
            </Button>
          </Box>
        )}
      </Stack>
      {valueLabels.map(({ value: key, label }) => (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={checklistState[key]}
              onChange={(e, checked) => onChecklistState({ ...checklistState, [key]: checked })}
            />
          }
          label={renderLabel(key, label)}
        />
      ))}
    </FormGroup>
  );
};
