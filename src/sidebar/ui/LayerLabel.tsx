import { Typography } from '@mui/material';
import { FC } from 'react';

import { MapShapeType, ShapeLegend } from '@/lib/map-shapes/ShapeLegend';

export interface LayerLabelProps {
  label: string;
  type: MapShapeType;
  color: string;
}

export const LayerLabel: FC<LayerLabelProps> = ({ label, type, color }) => {
  return (
    <>
      <Typography>
        <ShapeLegend type={type} color={color} />
        {label}
      </Typography>
    </>
  );
};
