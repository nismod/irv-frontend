import { WebMercatorViewport } from 'deck.gl/typed';
import { FC, useEffect } from 'react';
import { useMap } from 'react-map-gl/maplibre';

import { appToDeckBoundingBox, BoundingBox } from '@/lib/bounding-box';

interface MapBoundsFitterProps {
  boundingBox: BoundingBox;
}

export const MapBoundsFitter: FC<MapBoundsFitterProps> = ({ boundingBox }) => {
  const { current: map } = useMap();

  useEffect(() => {
    if (boundingBox != null && map != null) {
      map.fitBounds(boundingBox, {});
    }
  }, [boundingBox, map]);

  return null;
};

export function getBoundingBoxViewState(
  boundingBox: BoundingBox,
  viewportWidth = 800,
  viewportHeight = 600,
) {
  const deckBbox = appToDeckBoundingBox(boundingBox);
  const viewport = new WebMercatorViewport({ width: viewportWidth, height: viewportHeight });
  const { latitude, longitude, zoom } = viewport.fitBounds(deckBbox, { padding: 20 });

  return { latitude, longitude, zoom };
}
