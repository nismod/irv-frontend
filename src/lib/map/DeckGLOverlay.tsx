import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox';
import { forwardRef, useImperativeHandle } from 'react';
import { useControl } from 'react-map-gl/maplibre';

type DeckGLOverlayProps = MapboxOverlayProps;

export const DeckGLOverlay = forwardRef<MapboxOverlay, DeckGLOverlayProps>((props, ref) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);

  useImperativeHandle(ref, () => overlay);

  return null;
});
