import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import { BoundingBox } from '@/lib/bounding-box';

import { mapFitBoundsState } from './MapView';

export function useMapFitBounds() {
  const setMapFitBounds = useSetRecoilState(mapFitBoundsState);

  const handleSetMapFitBounds = useCallback(
    (bounds: BoundingBox) => {
      setMapFitBounds([...bounds]);
    },
    [setMapFitBounds],
  );

  return {
    setMapFitBounds: handleSetMapFitBounds,
  };
}
