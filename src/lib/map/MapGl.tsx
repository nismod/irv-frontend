import { useEffect } from 'react';
import { Map, useMap } from 'react-map-gl/maplibre';

export const MapResizer = () => {
  const { current } = useMap();

  // Resize after render to ensure map fills container – patch for react-map-gl issue with Apple silicon chips
  useEffect(() => {
    current.resize();
  }, [current]);

  return null;
};

export const MapGl = ({ children, ...props }) => {
  return (
    <Map {...props}>
      <MapResizer />
      {children}
    </Map>
  );
};
