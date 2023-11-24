import { TabContext } from '@mui/lab';
import { BottomNavigation, Box } from '@mui/material';
import { FC, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { ContentWatcherScope } from '@/lib/mobile-tabs/content-watcher';
import { NonUnmountingTabPanel } from '@/lib/mobile-tabs/NonUnmountingTabPanel';
import { TabNavigationAction } from '@/lib/mobile-tabs/TabNavigationAction';

import { globalStyleVariables } from '@/theme';

import { MobileTabContentWatcher, mobileTabHasContentState } from './tab-has-content';
import { TabConfig } from './tabs-config';

import './bottom-sheet.css';

export const MobileBottomSheet: FC<{ tabsConfig: TabConfig[] }> = ({ tabsConfig }) => {
  const [bottomTabId, setBottomTabId] = useState(tabsConfig[0]?.id);

  return (
    <BottomSheet
      open={true}
      blocking={false}
      expandOnContentDrag={true}
      skipInitialTransition={true}
      snapPoints={({ footerHeight, maxHeight }) => [
        footerHeight + 38, // magic number to allow the puller/header to be visible at the smallest snap point
        maxHeight * 0.35,
        maxHeight * 0.6,
        maxHeight - globalStyleVariables.navbarHeight - 4,
      ]}
      footer={
        <Box sx={{ cursor: 'default' }}>
          <MobileBottomSheetTabNavigation
            tabsConfig={tabsConfig}
            selectedId={bottomTabId}
            setSelectedId={setBottomTabId}
          />
        </Box>
      }
      header={<Box height={10} />}
    >
      <MobileBottomSheetTabContent tabsConfig={tabsConfig} selectedId={bottomTabId} />
    </BottomSheet>
  );
};

const MobileBottomSheetTabNavigation: FC<{
  tabsConfig: TabConfig[];
  selectedId: string;
  setSelectedId: (x: string) => void;
}> = ({ tabsConfig, selectedId, setSelectedId }) => {
  return (
    <BottomNavigation showLabels value={selectedId} onChange={(e, value) => setSelectedId(value)}>
      {tabsConfig.map(({ id, label, IconComponent }) => (
        <TabNavigationAction
          key={id}
          label={label}
          IconComponent={IconComponent}
          value={id}
          tabHasContentState={mobileTabHasContentState}
        />
      ))}
    </BottomNavigation>
  );
};

const MobileTabPanel: FC<{ tabConfig: TabConfig }> = ({ tabConfig: { id, ContentComponent } }) => (
  <NonUnmountingTabPanel value={id}>
    <Box m={2}>
      <ContentWatcherScope watcher={<MobileTabContentWatcher tabId={id} />}>
        <ContentComponent />
      </ContentWatcherScope>
    </Box>
  </NonUnmountingTabPanel>
);

const MobileBottomSheetTabContent: FC<{
  tabsConfig: TabConfig[];
  selectedId: string;
}> = ({ tabsConfig, selectedId }) => {
  return (
    <TabContext value={selectedId}>
      {tabsConfig.map((tabConfig) => (
        <MobileTabPanel key={tabConfig.id} tabConfig={tabConfig} />
      ))}
    </TabContext>
  );
};
