import React, { Children, FC, ReactNode } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import { useRecoilValue } from 'recoil';

import { hoverPositionState } from './interactions/interaction-state';

/** Positions children from the hover anchor (lng/lat), projected into the map container. Hidden if the anchor is off-canvas or there are no children. */
export const DataMapTooltip: FC<{ children?: ReactNode }> = ({ children }) => {
  const anchor = useRecoilValue(hoverPositionState);
  const mapRef = useMap()?.current;
  const map = mapRef?.getMap();

  if (!map || !anchor || Children.count(children) === 0) {
    return null;
  }

  const { x, y } = map.project([anchor.lng, anchor.lat]);
  const { clientWidth: w, clientHeight: h } = map.getContainer();

  const inBounds = x > 0 && x < w && y > 0 && y < h;
  if (!inBounds) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 1000,
        pointerEvents: 'none',
        left: x + 10,
        top: y,
      }}
    >
      {children}
    </div>
  );
};
