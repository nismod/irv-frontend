import { makeViewLayersAtom } from '@/lib/data-map/state/make-view-layers-atom';

import { buildingDensityLayerAtom } from './data-layers/building-density';
import { cddLayersAtom } from './data-layers/cdd';
import { hazardLayersAtom } from './data-layers/hazards';
import { hdiGridLayerAtom } from './data-layers/hdi-grid';
import { healthcareLayersAtom } from './data-layers/healthcare';
import { humanDevelopmentLayerAtom } from './data-layers/human-development';
import { industryLayersAtom } from './data-layers/industry';
import { landCoverLayerAtom } from './data-layers/land-cover';
import {
  biodiversityIntactnessLayerAtom,
  forestLandscapeIntegrityLayerAtom,
} from './data-layers/nature-vulnerability';
import { nbsLayerAtom, nbsScopeRegionLayerAtom } from './data-layers/nbs';
import { networkLayersAtom } from './data-layers/networks';
import { organicCarbonLayerAtom } from './data-layers/organic-carbon';
import { populationLayerAtom } from './data-layers/population';
import { populationExposureLayerAtom } from './data-layers/population-exposure';
import {
  protectedAreasPointLayerAtom,
  protectedAreasPolygonLayerAtom,
} from './data-layers/protected-areas';
import { regionalExposureLayerAtom } from './data-layers/regional-risk';
import { rwiLayerAtom } from './data-layers/rwi';
import { topographyLayersAtom } from './data-layers/topography';
import { travelTimeLayerAtom } from './data-layers/travel-time';
import { featureBoundingBoxLayerAtom } from './ui-layers/feature-bbox';

export const viewLayersAtom = makeViewLayersAtom([
  /**
   * Data layers
   */

  // raster layers that cover all/most of land
  landCoverLayerAtom,
  populationLayerAtom,
  buildingDensityLayerAtom,
  organicCarbonLayerAtom,
  biodiversityIntactnessLayerAtom,
  forestLandscapeIntegrityLayerAtom,
  travelTimeLayerAtom,
  topographyLayersAtom,
  cddLayersAtom,
  hdiGridLayerAtom,

  // vector layers that cover all/most of land
  humanDevelopmentLayerAtom,
  regionalExposureLayerAtom,

  // vector / raster layers that cover some land
  protectedAreasPolygonLayerAtom,
  hazardLayersAtom,
  populationExposureLayerAtom,
  nbsLayerAtom,
  rwiLayerAtom,

  // point/line layers
  networkLayersAtom,
  industryLayersAtom,
  healthcareLayersAtom,
  protectedAreasPointLayerAtom,

  /**
   * UI Layers
   */
  nbsScopeRegionLayerAtom,

  featureBoundingBoxLayerAtom,
]);
