import Box from '@mui/material/Box';
import { FC } from 'react';

import { PixelRecord } from '../types';
import { CoastalFlooding } from './hazard/aqueduct-coastal';
import { RiverFloodingAqueduct } from './hazard/aqueduct-river';
import { TropicalCyclonesIris } from './hazard/cyclone-iris';
import { TropicalCyclonesStorm } from './hazard/cyclone-storm';
import { Droughts } from './hazard/droughts';
import { Earthquakes } from './hazard/earthquakes';
import { ExtremeHeat } from './hazard/extreme-heat';
import { RiverFloodingJrc } from './hazard/jrc-flood';

export interface PixelDrillerLayerListProps {
  records: PixelRecord[];
}

export const PixelDrillerLayerList: FC<PixelDrillerLayerListProps> = ({ records }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <RiverFloodingAqueduct records={records} />
      <RiverFloodingJrc records={records} />
      <CoastalFlooding records={records} />
      <TropicalCyclonesIris records={records} />
      <TropicalCyclonesStorm records={records} />
      {/* <CoolingDegreeDays records={records} /> */}
      <ExtremeHeat records={records} />
      <Droughts records={records} />
      {/* <Landslides records={records} /> */}
      <Earthquakes records={records} />
    </Box>
  );
};
