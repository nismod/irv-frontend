import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { ConfigTree } from '@/lib/nested-config/config-tree';

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

export const viewLayersState = selector<ConfigTree<ViewLayer>>({
  key: 'viewLayersState',
  get: ({ get }) => {
    return [
      /**
       * Data layers
       */

      get(landCoverLayerState),
      get(humanDevelopmentLayerState),
      get(populationLayerState),
      get(buildingDensityLayerState),
      get(organicCarbonLayerState),
      get(biodiversityIntactnessLayerState),
      get(forestLandscapeIntegrityLayerState),
      get(protectedAreasPolygonLayerState),
      get(travelTimeLayerState),
      get(hazardLayerState),
      get(populationExposureLayerState),
      get(networkLayersState),
      get(industryLayersState),
      get(healthcareLayersState),
      get(protectedAreasPointLayerState),
      get(regionalExposureLayerState),

      /**
       * UI Layers
       */

      get(featureBoundingBoxLayerState),
    ];
  },
});
