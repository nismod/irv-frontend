import { FC } from 'react';

import { RouteParamSync } from '@/lib/jotai/sync-stores/route-param-sync';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { viewAtom } from '@/state/view';
import { useIsMobile } from '@/use-is-mobile';

import { MapPageDesktopLayout } from './layouts/MapPageDesktopLayout';
import { MapPageMobileLayout } from './layouts/mobile/MapPageMobileLayout';

const MapPageLayout = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MapPageMobileLayout /> : <MapPageDesktopLayout />;
};

export const MapPage: FC = () => {
  return (
    <ErrorBoundary message="There was a problem displaying this page.">
      <RouteParamSync atom={viewAtom} paramName="view">
        <MapPageLayout />
      </RouteParamSync>
    </ErrorBoundary>
  );
};
