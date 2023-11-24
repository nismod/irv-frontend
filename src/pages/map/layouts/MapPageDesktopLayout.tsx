import { Box } from '@mui/material';

import { MapHud } from '@/lib/map/hud/MapHud';
import { MapHudRegion } from '@/lib/map/hud/MapHudRegion';

import { DetailsContent } from '@/details/DetailsContent';
import { MapLayerSelection } from '@/map/layers/MapLayerSelection';
import { MapLegend } from '@/map/legend/MapLegend';
import { MapView } from '@/map/MapView';
import { LayersSidebar } from '@/sidebar/LayersSidebar';
import { globalStyleVariables } from '@/theme';

import {
  AppAttributionControl,
  AppNavigationControl,
  AppPlaceSearch,
  AppScaleControl,
} from './hud';

const SidebarLayout = ({ top, bottom, left, right, width, children }) => (
  <Box
    position="absolute"
    top={top}
    bottom={bottom}
    left={left}
    right={right}
    width={width - 20}
    zIndex={1000}
    sx={{ pointerEvents: 'none' }}
  >
    <Box
      overflow="auto"
      maxHeight="100%"
      sx={{ pointerEvents: 'auto' }}
      position="absolute"
      left={0}
      right={-20}
      top={0}
    >
      <Box width={width - 20}>
        <Box pl={1} pt={1} sx={{ pointerEvents: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  </Box>
);

const MapHudDesktopLayout = () => {
  return (
    <MapHud left={globalStyleVariables.controlSidebarWidth}>
      <MapHudRegion position="top-left" StackProps={{ spacing: 1 }}>
        <AppPlaceSearch />
        <MapLayerSelection />
      </MapHudRegion>
      <MapHudRegion position="top-right">
        <AppNavigationControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-right" style={{ maxWidth: '40%' }}>
        <AppScaleControl />
        <AppAttributionControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-left">
        <MapLegend />
      </MapHudRegion>
    </MapHud>
  );
};

export const MapPageDesktopLayout = () => {
  return (
    <>
      <SidebarLayout
        top={0}
        left={0}
        bottom={0}
        right={undefined}
        width={globalStyleVariables.controlSidebarWidth}
      >
        <LayersSidebar />
      </SidebarLayout>
      <Box position="absolute" overflow="clip" top={0} left={0} right={0} bottom={0}>
        <MapView>
          <MapHudDesktopLayout />
        </MapView>
      </Box>
      <SidebarLayout
        top={0}
        left={undefined}
        bottom={70}
        right={70}
        width={globalStyleVariables.detailSidebarWidth}
      >
        <DetailsContent />
      </SidebarLayout>
    </>
  );
};
