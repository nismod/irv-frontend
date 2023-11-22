import { FC } from 'react';

import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { useIsMobile } from '@/use-is-mobile';

import { MapPageDesktopLayout } from './layouts/MapPageDesktopLayout';
import { MapPageMobileLayout } from './layouts/mobile/MapPageMobileLayout';
import { MapViewRouteSync } from './MapViewRouteSync';

const MapPageLayout = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MapPageMobileLayout /> : <MapPageDesktopLayout />;
};

export const MapPage: FC = () => {
  return (
    <ErrorBoundary message="There was a problem displaying this page.">
      <MapViewRouteSync>
        <MapPageLayout />
      </MapViewRouteSync>
    </ErrorBoundary>
  );
};
