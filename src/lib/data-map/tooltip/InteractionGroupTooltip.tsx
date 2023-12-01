import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';

import { hoverState } from '@/lib/data-map/interactions/interaction-state';
import { InteractionTarget } from '@/lib/data-map/interactions/types';

const ViewLayerTooltip = ({ hover }: { hover: InteractionTarget }) => {
  const { viewLayer } = hover;

  return <>{viewLayer.renderTooltip?.(hover)}</>;
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

  WrapperComponent?: React.ComponentType;
}) => {
  const hoveredObjects = useRecoilValue(hoverState(group));

  if (hoveredObjects.length === 0) return null;

  let contents: ReactNode = null;
  if (MergeComponent != null) {
    contents = <MergeComponent hoveredObjects={hoveredObjects} />;
  } else {
    contents = hoveredObjects.map((h) => <ViewLayerTooltip key={h.viewLayer.id} hover={h} />);
  }

  return <WrapperComponent>{contents}</WrapperComponent>;
};
