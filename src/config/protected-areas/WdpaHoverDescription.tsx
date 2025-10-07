import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

import { InteractionTarget } from '@/lib/data-map/interactions/types';
import { ColorBox } from '@/lib/ui/data-display/ColorBox';

import { PROTECTED_AREA_COLORS } from './metadata';

export const WdpaHoverDescription: FC<{
  hoveredObjects: InteractionTarget<any>[];
}> = ({ hoveredObjects }) => {
  return (
    <>
      <Typography variant="body2">Protected Areas</Typography>
      {hoveredObjects.map((ho) => {
        const feature = ho.target.feature;
        const color = PROTECTED_AREA_COLORS[ho.viewLayer.params.type].css;
        return (
          <Box key={feature.properties.WDPA_PID}>
            <ColorBox color={color} />
            {feature.properties.NAME}
          </Box>
        );
      })}
    </>
  );
};
