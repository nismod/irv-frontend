import React, { FC, ReactNode } from 'react';
import { useRecoilValue } from 'recoil';

import { hoverPositionState } from './interactions/interaction-state';

/** Component which absolutely positions its children based on the current hover position state.
 *
 * Only outputs content if hover state exists and the children are non-empty.
 */
export const DataMapTooltip: FC<{ children?: ReactNode }> = ({ children }) => {
  const tooltipXY = useRecoilValue(hoverPositionState);

  return tooltipXY && React.Children.count(children) ? (
    <div
      style={{
        position: 'absolute',
        zIndex: 1000,
        pointerEvents: 'none',
        left: tooltipXY[0] + 10,
        top: tooltipXY[1],
      }}
    >
      {children}
    </div>
  ) : null;
};
