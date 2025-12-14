import { MapViewState } from 'deck.gl';
import { ComponentProps, FC, ReactNode, useCallback } from 'react';
import { Map, MapMouseEvent } from 'react-map-gl/maplibre';

export interface BaseMapProps {
  /** Map style configuration. Same as `mapStyle` of the rect-map-gl component. */
  mapStyle: ComponentProps<typeof Map>['mapStyle'];
  /** View state of the map */
  viewState: MapViewState;
  /** Handler called when the map view state changes */
  onViewState: (vs: MapViewState) => void;
  /** Handler called when the map is clicked */
  onClick?: (event: MapMouseEvent) => void;
  children?: ReactNode;
}

/**
 * Displays a react-map-gl basemap component.
 * Accepts children such as a DeckGLOverlay, HUD controls etc
 */
export const BaseMap: FC<BaseMapProps> = ({
  mapStyle,
  viewState,
  onViewState,
  onClick,
  children,
}) => {
  /**
   * until `react-map-gl` supports `touchRotate={false}` prop
   */
  const mapRefFn = useCallback((refObj) => {
    refObj?.getMap()?.touchZoomRotate?.disableRotation();
  }, []);

  const handleClick = useCallback((event: MapMouseEvent) => onClick?.(event), [onClick]);

  return (
    <Map
      ref={mapRefFn}
      reuseMaps={true}
      styleDiffing={true}
      {...viewState}
      onMove={({ viewState }) => onViewState(viewState)}
      onClick={handleClick}
      mapStyle={mapStyle}
      dragRotate={false}
      keyboard={false}
      touchZoomRotate={true}
      touchPitch={false}
      canvasContextAttributes={{
        antialias: true,
      }}
      attributionControl={false}
    >
      {children}
    </Map>
  );
};
