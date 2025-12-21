import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';

import { hoverState } from '@/lib/data-map/interactions/interaction-state';
import { InteractionTarget } from '@/lib/data-map/interactions/types';

const ViewLayerTooltipOld = ({ hover }: { hover: InteractionTarget }) => {
  const { viewLayer } = hover;

  if (viewLayer.type === 'old') {
    return <>{viewLayer.renderTooltip?.(hover)}</>;
  } else {
    throw new Error('ViewLayerTooltipOld only supports old style view layers');
  }
};

/**
 * Display a tooltip for an interaction group.
 */
export const InteractionGroupTooltip = ({
  group,
  MergeComponent,
  WrapperComponent = React.Fragment,
}: {
  /** Interaction group for which to display hover info */
  group: string;
  /**
   * If supplied, the info about all hovered objects for the group will be passed to this component,
   * instead of generating `ViewLayerTooltip` individually for each object
   */
  MergeComponent?: React.ComponentType<{ hoveredObjects: InteractionTarget[] }>;

  WrapperComponent?: React.ComponentType<{ children?: ReactNode }>;
}) => {
  const hoveredObjects = useRecoilValue(hoverState(group));

  if (hoveredObjects.length === 0) return null;

  let contents: ReactNode = null;
  if (MergeComponent != null) {
    contents = <MergeComponent hoveredObjects={hoveredObjects} />;
  } else {
    contents = hoveredObjects.map((h) => <ViewLayerTooltipOld key={h.viewLayer.id} hover={h} />);
  }

  return <WrapperComponent>{contents}</WrapperComponent>;
};
