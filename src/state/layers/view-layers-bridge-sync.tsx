import { useAtomValue } from 'jotai';

import { useSyncValueToRecoil } from '@/lib/recoil/state-sync/use-sync-state';

import { hazardLayersAtom, hazardLayerState } from '@/state/layers/data-layers/hazards';
import {
  nbsLayerAtom,
  nbsLayerState,
  nbsScopeRegionLayerAtom,
  nbsScopeRegionLayerState,
} from '@/state/layers/data-layers/nbs';
import { networkLayersAtom, networkLayersState } from '@/state/layers/data-layers/networks';
import {
  populationExposureLayerAtom,
  populationExposureLayerState,
} from '@/state/layers/data-layers/population-exposure';
import {
  regionalExposureLayerAtom,
  regionalExposureLayerState,
} from '@/state/layers/data-layers/regional-risk';
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

  useSyncValueToRecoil(hazardLayers, hazardLayerState);
  useSyncValueToRecoil(nbsLayer, nbsLayerState);
  useSyncValueToRecoil(nbsScopeRegionLayer, nbsScopeRegionLayerState);
  useSyncValueToRecoil(featureBboxLayer, featureBoundingBoxLayerState);
  useSyncValueToRecoil(networkLayers, networkLayersState);
  useSyncValueToRecoil(populationExposureLayer, populationExposureLayerState);
  useSyncValueToRecoil(regionalExposureLayer, regionalExposureLayerState);

  return null;
}
