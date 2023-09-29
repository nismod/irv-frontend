import { Box } from '@mui/material';
import React, { FC, ReactNode } from 'react';
import { useRecoilValue } from 'recoil';

import { hoverState } from '@/lib/data-map/interactions/interaction-state';
import { InteractionTarget } from '@/lib/data-map/interactions/types';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { AutoHidePaper, PreventHide } from './auto-hide';
import { WdpaHoverDescription } from './content/WdpaHoverDescription';

const TooltipSection = ({ children }) => (
  <Box px={1} py={0.5} borderBottom="1px solid #ccc">
    <PreventHide />
    {children}
  </Box>
);

const ViewLayerTooltip = ({ hover }: { hover: InteractionTarget }) => {
  const { viewLayer } = hover;

  return <>{viewLayer.renderTooltip?.(hover)}</>;
};

const InteractionGroupTooltip = ({
  group,
  MergeComponent,
}: {
  /** Interaction group for which to display hover info */
  group: string;
  /**
   * If supplied, the info about all hovered objects for the group will be passed to this component,
   * instead of generating `ViewLayerTooltip` individually for each object
   */
  MergeComponent?: React.ComponentType<{ hoveredObjects: InteractionTarget[] }>;
}) => {
  const hoveredObjects = useRecoilValue(hoverState(group));

  if (hoveredObjects.length === 0) return null;

  let contents: ReactNode = null;
  if (MergeComponent != null) {
    contents = <MergeComponent hoveredObjects={hoveredObjects} />;
  } else {
    contents = hoveredObjects.map((h) => <ViewLayerTooltip key={h.viewLayer.id} hover={h} />);
  }

  return <TooltipSection>{contents}</TooltipSection>;
};

export const TooltipContent: FC = () => {
  return (
    <AutoHidePaper>
      <Box minWidth={200}>
        <ErrorBoundary message="There was a problem displaying the tooltip.">
          <InteractionGroupTooltip group="assets" />
          <InteractionGroupTooltip group="hazards" />
          <InteractionGroupTooltip group="raster_assets" />
          <InteractionGroupTooltip group="hdi" />
          <InteractionGroupTooltip group="rexp" />
          <InteractionGroupTooltip group="wdpa" MergeComponent={WdpaHoverDescription} />
        </ErrorBoundary>
      </Box>
    </AutoHidePaper>
  );
};
