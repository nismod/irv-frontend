import { FC } from 'react';

import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { SidebarContent } from './SidebarContent';

export const LayersSidebar: FC = () => {
  return (
    <ErrorBoundary message="There was a problem displaying the sidebar.">
      <ContentWatcher />
      <SidebarContent />
    </ErrorBoundary>
  );
};
