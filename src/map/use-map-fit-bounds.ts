import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { BoundingBox } from '@/lib/bounding-box';

import { mapFitBoundsAtom } from '@/state/map-view/map-view-state';

export function useMapFitBounds() {
  const setMapFitBounds = useSetAtom(mapFitBoundsAtom);

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
