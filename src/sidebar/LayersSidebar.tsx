import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { MobileTabContentWatcher } from '@/pages/map/layouts/mobile/tab-has-content';
import { LAYERS_MOBILE_TAB_ID } from '@/pages/map/layouts/mobile/tabs-config';

import { SidebarContent } from './SidebarContent';

export const LayersSidebar = () => (
  <ErrorBoundary message="There was a problem displaying the sidebar.">
    <MobileTabContentWatcher tabId={LAYERS_MOBILE_TAB_ID} />
    <SidebarContent />
  </ErrorBoundary>
);
