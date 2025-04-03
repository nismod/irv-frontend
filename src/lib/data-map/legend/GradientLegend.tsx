import { Box, Fade, Tooltip, Typography } from '@mui/material';
import { FC, memo, ReactNode } from 'react';

import { LegendLayout } from './LegendLayout';

export interface ColorValue {
  color: string;
  value: any;
}

/** Representation of the values of a number-color mapping */
export interface ColorMapValues {
  /** Array of color-value pairs */
  colorMapValues: ColorValue[];
  /** Two-element boolean tuple indicating if the color scale is truncated at the min/max ends
   * For example, [true, false] means that all values equal to and lower than the minimum value are displayed
   * as the color corresponding to that minimum value.
   */
  rangeTruncated: [boolean, boolean];
}

const legendHeight = 10;

/** Helper function to format the label for a value by prepending less/greater-than-or-equal signs depending on whether the min/max values of the color scale are truncated. */
export function formatRangeTruncation(
  /** value to be formatted */
  value: ReactNode | string,
  /** Index of value-color pair in the list of color map values */
  i: number,
  /** Is the color scale truncated at the minValue / maxValue end? */
  [minTruncated, maxTruncated]: [boolean, boolean],
) {
  if (i === 0 && minTruncated) {
    return <>&le;{value}</>;
  }
  // terracotta sends 255 color values, so last index is 254
  if (i === 254 && maxTruncated) {
    return <>&ge;{value}</>;
  }
  return value;
}

const LegendGradient: FC<{
  colorMap: ColorMapValues;
  getValueLabel: (value: number) => ReactNode | string;
}> = ({ colorMap, getValueLabel }) => {
  const { colorMapValues, rangeTruncated } = colorMap;
  return (
    <>
      {colorMapValues.map(({ color, value }, i) => (
        <Tooltip
          key={i}
          title={formatRangeTruncation(getValueLabel(value), i, rangeTruncated)}
          arrow
          placement="top"
          enterDelay={200}
          leaveDelay={0}
          // deactivates transition animation
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 0 }}
        >
          <Box height={legendHeight} flexGrow={1} bgcolor={color} />
        </Tooltip>
      ))}
    </>
  );
};

export interface GradientLegendProps {
  /** Legend title/label */
  label: string | ReactNode;
  /** Additional legend description */
  description?: string;
  /** Range of values [min, max] */
  range: [number, number];
  /** Color map values specification */
  colorMap: ColorMapValues;
  /** Function called to get the label for a value */
  getValueLabel: (x: any) => ReactNode | string;
}

/** Base UI component for a color scale legend represented by a color gradient with labels for min/max value */
export const GradientLegend: FC<GradientLegendProps> = memo(
  ({ label, description, range, colorMap, getValueLabel }) => {
    return (
      <LegendLayout label={label} description={description}>
        <Box
          height={legendHeight + 2}
          width={256}
          bgcolor="#ccc"
          display="flex"
          flexDirection="row"
          border="1px solid gray"
        >
          {colorMap && <LegendGradient colorMap={colorMap} getValueLabel={getValueLabel} />}
        </Box>
        <Box height={10} position="relative">
          {colorMap && (
            <>
              <Box position="absolute" left={0}>
                <Typography>{getValueLabel(range[0])}</Typography>
              </Box>
              <Box position="absolute" right={0}>
                <Typography>{getValueLabel(range[1])}</Typography>
              </Box>
            </>
          )}
        </Box>
      </LegendLayout>
    );
  },
);
