import { FormControl, FormLabel, MenuItem, Select, SelectProps } from '@mui/material';
import { useCallback } from 'react';

import { getValueLabel, ValueLabel } from './params/value-label';

interface ParamDropdownProps<V extends string | number = string> {
  /** Title of the input */
  title?: string;
  /** Current selected value */
  value: V;
  /** List of available options (either of the same type as value, or wrapped in `ValueLabel` objects) */
  options: (V | ValueLabel<V>)[];
  /** Handler called when selected value changes */
  onChange: (value: V) => void;
  /** Is this input disabled? False by default */
  disabled?: boolean;
  /** Variant of the component - passed to MUI Select */
  variant?: SelectProps['variant'];
}

/**
 * Simple UI component for a (full-width) selection dropdown with a title.
 * @template V input value type
 */
export const ParamDropdown = <V extends string | number = string>({
  title,
  value,
  onChange,
  options,
  disabled = false,
  variant = undefined,
}: ParamDropdownProps<V>) => {
  const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);
  return (
    <FormControl fullWidth>
      {title && <FormLabel>{title}</FormLabel>}
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        variant={variant}
        disabled={disabled || options.length < 2}
      >
        {options.map((option) => {
          let { value, label } = getValueLabel(option);

          return (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
