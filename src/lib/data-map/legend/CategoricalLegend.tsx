import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, memo, ReactNode } from 'react';

import { MapShapeType, shapeComponents } from '@/lib/map-shapes/shapes';

import { LegendLayout } from './LegendLayout';

export interface CategoricalLegendItem {
  color: string;
  value: any;
  label: ReactNode | string;
  shape?: MapShapeType;
}

const legendItemHeight = 12;

/** Helper function to render a legend item with color and label */
const LegendItem: FC<CategoricalLegendItem> = ({ color, label, shape = 'square' }) => {
  const ShapeComponent = shapeComponents[shape];
  return (
    <Box display="flex" alignItems="center">
      <Box mr={1} display="flex" alignItems="center">
        <ShapeComponent
          width={legendItemHeight}
          height={legendItemHeight}
          fill={color}
          stroke="gray"
          strokeWidth={1}
        />
      </Box>
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};

export interface CategoricalLegendProps {
  /** Legend title/label */
  label: string | ReactNode;
  /** Additional legend description */
  description?: string;
  /** Categorical color map values specification */
  items: CategoricalLegendItem[];
}

/** Base UI component for a categorical color legend represented by discrete color-label pairs */
export const CategoricalLegend: FC<CategoricalLegendProps> = memo(
  ({ label, description, items }) => (
    <LegendLayout label={label} description={description}>
      <Stack gap={0.5}>
        {items?.map((item, i) => (
          <LegendItem key={i} {...item} />
        ))}
      </Stack>
    </LegendLayout>
  ),
);
