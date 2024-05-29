import { waitForAll } from 'recoil';

import { makeViewLayersState } from '@/lib/data-map/state/make-view-layers-state';

import { buildingDensityLayerState } from './data-layers/building-density';
import { hazardLayerState } from './data-layers/hazards';
import { healthcareLayersState } from './data-layers/healthcare';
import { humanDevelopmentLayerState } from './data-layers/human-development';
import { industryLayersState } from './data-layers/industry';
import { landCoverLayerState } from './data-layers/land-cover';
import {
  biodiversityIntactnessLayerState,
  forestLandscapeIntegrityLayerState,
} from './data-layers/nature-vulnerability';
import { networkLayersState } from './data-layers/networks';
import { organicCarbonLayerState } from './data-layers/organic-carbon';
import { populationLayerState } from './data-layers/population';
import { populationExposureLayerState } from './data-layers/population-exposure';
import {
  protectedAreasPointLayerState,
  protectedAreasPolygonLayerState,
} from './data-layers/protected-areas';
import { regionalExposureLayerState } from './data-layers/regional-risk';
import { topographyLayersState } from './data-layers/topography';
import { travelTimeLayerState } from './data-layers/travel-time';
import { featureBoundingBoxLayerState } from './ui-layers/feature-bbox';

export const viewLayersState = makeViewLayersState({
  key: 'viewLayersState',
  getViewLayers: ({ get }) => {
    return get(
      waitForAll([
        /**
         * Data layers
         */

        // raster layers that cover all/most of land
        landCoverLayerState,
        populationLayerState,
        buildingDensityLayerState,
        organicCarbonLayerState,
        biodiversityIntactnessLayerState,
        forestLandscapeIntegrityLayerState,
        travelTimeLayerState,
        topographyLayersState,

        // vector layers that cover all/most of land
        humanDevelopmentLayerState,
        regionalExposureLayerState,

        // vector / raster layers that cover some land
        protectedAreasPolygonLayerState,
        hazardLayerState,
        populationExposureLayerState,

        // point/line layers
        networkLayersState,
        industryLayersState,
        healthcareLayersState,
        protectedAreasPointLayerState,

        /**
         * UI Layers
         */

        featureBoundingBoxLayerState,
      ]),
    );
  },
});
