import { Slider, SliderProps } from '@mui/material';
import { FC, useCallback, useMemo } from 'react';

type CustomSliderProps<T> = {
  /** Array of slider mark values. Can be any arbitrary values, e.g. [1, 2, 3, 10, 100, 500] */
  marks: T[];
  /** Current selected value */
  value: T;
  /** Handler called when value changes */
  onChange: (newVal: T) => void;
  /** Array of mark values for which labels should be displayed */
  showMarkLabelsFor?: T[];
} & Omit<SliderProps, 'marks' | 'value' | 'onChange' | 'min' | 'max' | 'step' | 'scale'>;

/**
 * Custom slider component that accepts an arbitrary array of marks (number with an unequal step etc).
 *
 * Useful when you want a slider interaction but the numbers on the axis are not evenly distributed.
 */
export const CustomNumberSlider: FC<CustomSliderProps<number>> = ({
  marks,
  value,
  onChange,
  showMarkLabelsFor,
  ...otherProps
}) => {
  const showLabelLookup = useMemo(
    () => showMarkLabelsFor && Object.fromEntries(showMarkLabelsFor.map((ml) => [ml, true])),
    [showMarkLabelsFor],
  );
  const integerMarks = useMemo(() => {
    return marks.map((m, idx) => ({
      value: idx,
      label: !showLabelLookup || showLabelLookup[m] ? m.toString() : null,
    }));
  }, [marks, showLabelLookup]);
  const integerValue = useMemo(() => marks.findIndex((m) => m === value), [marks, value]);

  const handleIntegerChange = useCallback(
    (e: Event, value: number) => {
      onChange(marks[value]);
    },
    [marks, onChange],
  );

  const valueLabelFunction = useCallback((value) => marks[value].toString(), [marks]);

  return (
    <Slider
      marks={integerMarks}
      value={integerValue}
      onChange={handleIntegerChange}
      min={0}
      max={marks.length - 1}
      step={1}
      valueLabelFormat={valueLabelFunction}
      getAriaValueText={valueLabelFunction}
      {...otherProps}
    />
  );
};
