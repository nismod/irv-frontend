import { Box } from '@mui/material';

import { MapHud } from '@/lib/map/hud/MapHud';
import { MapHudRegion } from '@/lib/map/hud/MapHudRegion';

import { MapLayerSelection } from '@/map/layers/MapLayerSelection';
import { MapView } from '@/map/MapView';

import {
  AppAttributionControl,
  AppNavigationControl,
  AppPlaceSearch,
  AppScaleControl,
} from '../hud';
import { MobileBottomSheet } from './MobileBottomSheet';
import { MOBILE_TABS_CONFIG } from './tabs-config';

export const MapPageMobileLayout = () => (
  <>
    <Box position="absolute" overflow="clip" top={0} left={0} right={0} bottom={0}>
      <MapView>
        <MapHudMobileLayout />
      </MapView>
    </Box>
    <MobileBottomSheet tabsConfig={MOBILE_TABS_CONFIG} />
  </>
);

const MapHudMobileLayout = () => {
  return (
    <MapHud bottom={120}>
      <MapHudRegion position="top-left" StackProps={{ spacing: 1 }}>
        <AppPlaceSearch />
        <MapLayerSelection />
      </MapHudRegion>
      <MapHudRegion position="top-right">
        <AppNavigationControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-right">
        <AppScaleControl />
        <AppAttributionControl />
      </MapHudRegion>
    </MapHud>
  );
};
