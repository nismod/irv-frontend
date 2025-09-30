import { Box } from '@mui/material';
import React, { FC } from 'react';

import { AutoHidePaper, PreventHide } from '@/lib/data-map/tooltip/auto-hide';
import { InteractionGroupTooltip } from '@/lib/data-map/tooltip/InteractionGroupTooltip';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';
import { withProps } from '@/lib/react/with-props';

import { WdpaHoverDescription } from '@/config/protected-areas/WdpaHoverDescription';

declare module '@/lib/data-map/view-layers' {
  interface KnownViewLayerSlots {
    Tooltip?: NoProps;
  }
}

const TooltipSection = ({ children }) =>
  children && (
    <Box px={1} py={0.5} borderBottom="1px solid #ccc">
      <PreventHide />
      {children}
    </Box>
  );

const InteractionGroupTooltipWrapped = withProps(InteractionGroupTooltip, {
  WrapperComponent: TooltipSection,
});

export const TooltipContent: FC = () => {
  return (
    <AutoHidePaper>
      <Box minWidth={200}>
        <ErrorBoundary message="There was a problem displaying the tooltip.">
          <InteractionGroupTooltipWrapped group="assets" />
          <InteractionGroupTooltipWrapped group="hazards" />
          <InteractionGroupTooltipWrapped group="raster_assets" />
          <InteractionGroupTooltipWrapped group="hdi" />
          <InteractionGroupTooltipWrapped group="rexp" />
          <InteractionGroupTooltipWrapped group="wdpa" MergeComponent={WdpaHoverDescription} />
          <InteractionGroupTooltipWrapped group="scope_regions" />
        </ErrorBoundary>
      </Box>
    </AutoHidePaper>
  );
};
