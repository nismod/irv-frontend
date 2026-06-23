import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

import { PixelRecord } from '../types';
import { Buildings } from './exposure/buildings';
import { LandCover } from './exposure/land-cover';
import { Population } from './exposure/population';
import { SoilOrganicCarbon } from './exposure/soil-organic-carbon';
import { Topography } from './exposure/topography';
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
      <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
        Hazards
      </Typography>
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

      <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
        Exposure
      </Typography>
      <Population records={records} />
      <Buildings records={records} />
      <LandCover records={records} />
      <Topography records={records} />
      <SoilOrganicCarbon records={records} />
    </Box>
  );
};
