import { MapLibreOverlay, MapLibreOverlayProps } from '@deck.gl/maplibre';
import { forwardRef, useImperativeHandle } from 'react';
import { useControl } from 'react-map-gl/maplibre';

type DeckGLOverlayProps = MapLibreOverlayProps;

export const DeckGLOverlay = forwardRef<MapLibreOverlay, DeckGLOverlayProps>((props, ref) => {
  const overlay = useControl<MapLibreOverlay>(() => new MapLibreOverlay(props));
  overlay.setProps(props);

  useImperativeHandle(ref, () => overlay);

  return null;
});
