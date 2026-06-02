import { useAtomValue } from 'jotai';

import { useSyncValueToRecoil } from '@/lib/recoil/state-sync/use-sync-state';

import { hazardLayersAtom, hazardLayerState } from '@/state/layers/data-layers/hazards';
import { hdiGridLayerAtom, hdiGridLayerState } from '@/state/layers/data-layers/hdi-grid';
import { healthcareLayersAtom, healthcareLayersState } from '@/state/layers/data-layers/healthcare';
import { landCoverLayerAtom, landCoverLayerState } from '@/state/layers/data-layers/land-cover';
import {
  biodiversityIntactnessLayerAtom,
  biodiversityIntactnessLayerState,
  forestLandscapeIntegrityLayerAtom,
  forestLandscapeIntegrityLayerState,
} from '@/state/layers/data-layers/nature-vulnerability';
import {
  nbsLayerAtom,
  nbsLayerState,
  nbsScopeRegionLayerAtom,
  nbsScopeRegionLayerState,
} from '@/state/layers/data-layers/nbs';
import { networkLayersAtom, networkLayersState } from '@/state/layers/data-layers/networks';
import {
  organicCarbonLayerAtom,
  organicCarbonLayerState,
} from '@/state/layers/data-layers/organic-carbon';
import { populationLayerAtom, populationLayerState } from '@/state/layers/data-layers/population';
import {
  populationExposureLayerAtom,
  populationExposureLayerState,
} from '@/state/layers/data-layers/population-exposure';
import {
  regionalExposureLayerAtom,
  regionalExposureLayerState,
} from '@/state/layers/data-layers/regional-risk';
import { rwiLayerAtom, rwiLayerState } from '@/state/layers/data-layers/rwi';
import {
  featureBoundingBoxLayerAtom,
  featureBoundingBoxLayerState,
} from '@/state/layers/ui-layers/feature-bbox';

/**
 * Recoil↔Jotai migration bridge: Jotai-computed view layers → Recoil replica atoms
 * so `viewLayersState` keeps its waitForAll ordering (Slice 15 hub stays on Recoil).
 */
export function ViewLayersBridgeSync() {
  const hazardLayers = useAtomValue(hazardLayersAtom);
  const nbsLayer = useAtomValue(nbsLayerAtom);
  const nbsScopeRegionLayer = useAtomValue(nbsScopeRegionLayerAtom);
  const featureBboxLayer = useAtomValue(featureBoundingBoxLayerAtom);
  const networkLayers = useAtomValue(networkLayersAtom);
  const populationExposureLayer = useAtomValue(populationExposureLayerAtom);
  const regionalExposureLayer = useAtomValue(regionalExposureLayerAtom);
  const populationLayer = useAtomValue(populationLayerAtom);
  const landCoverLayer = useAtomValue(landCoverLayerAtom);
  const organicCarbonLayer = useAtomValue(organicCarbonLayerAtom);
  const biodiversityIntactnessLayer = useAtomValue(biodiversityIntactnessLayerAtom);
  const forestLandscapeIntegrityLayer = useAtomValue(forestLandscapeIntegrityLayerAtom);
  const hdiGridLayer = useAtomValue(hdiGridLayerAtom);
  const rwiLayer = useAtomValue(rwiLayerAtom);
  const healthcareLayers = useAtomValue(healthcareLayersAtom);

  useSyncValueToRecoil(hazardLayers, hazardLayerState);
  useSyncValueToRecoil(nbsLayer, nbsLayerState);
  useSyncValueToRecoil(nbsScopeRegionLayer, nbsScopeRegionLayerState);
  useSyncValueToRecoil(featureBboxLayer, featureBoundingBoxLayerState);
  useSyncValueToRecoil(networkLayers, networkLayersState);
  useSyncValueToRecoil(populationExposureLayer, populationExposureLayerState);
  useSyncValueToRecoil(regionalExposureLayer, regionalExposureLayerState);
  useSyncValueToRecoil(populationLayer, populationLayerState);
  useSyncValueToRecoil(landCoverLayer, landCoverLayerState);
  useSyncValueToRecoil(organicCarbonLayer, organicCarbonLayerState);
  useSyncValueToRecoil(biodiversityIntactnessLayer, biodiversityIntactnessLayerState);
  useSyncValueToRecoil(forestLandscapeIntegrityLayer, forestLandscapeIntegrityLayerState);
  useSyncValueToRecoil(hdiGridLayer, hdiGridLayerState);
  useSyncValueToRecoil(rwiLayer, rwiLayerState);
  useSyncValueToRecoil(healthcareLayers, healthcareLayersState);

  return null;
}
