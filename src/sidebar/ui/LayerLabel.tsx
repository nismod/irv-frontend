import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { MapShapeType, ShapeLegend } from '@/lib/map-shapes/ShapeLegend';

export interface LayerLabelProps {
  label: string;
  type: MapShapeType;
  color: string;
}

export const LayerLabel: FC<LayerLabelProps> = ({ label, type, color }) => {
  return (
    <Stack direction="row" alignItems="center">
      <ShapeLegend type={type} color={color} />
      <Typography>{label}</Typography>
    </Stack>
  );
};
