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
import { travelTimeLayerState } from './data-layers/travel-time';
import { featureBoundingBoxLayerState } from './ui-layers/feature-bbox';

export const viewLayersState = makeViewLayersState({
  key: 'viewLayersState',
  getViewLayers: ({ get }) => {
    return [
      /**
       * Data layers
       */

      // raster layers that cover all/most of land
      get(landCoverLayerState),
      get(populationLayerState),
      get(buildingDensityLayerState),
      get(organicCarbonLayerState),
      get(biodiversityIntactnessLayerState),
      get(forestLandscapeIntegrityLayerState),
      get(travelTimeLayerState),

      // vector layers that cover all/most of land
      get(humanDevelopmentLayerState),
      get(regionalExposureLayerState),

      // vector / raster layers that cover some land
      get(protectedAreasPolygonLayerState),
      get(hazardLayerState),
      get(populationExposureLayerState),

      // point/line layers
      get(networkLayersState),
      get(industryLayersState),
      get(healthcareLayersState),
      get(protectedAreasPointLayerState),

      /**
       * UI Layers
       */

      get(featureBoundingBoxLayerState),
    ];
  },
});
