import { TabContext } from '@mui/lab';
import { BottomNavigation, Box, Paper } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { Drawer } from 'vaul';

import { ContentWatcherScope } from '@/lib/mobile-tabs/content-watcher';
import { NonUnmountingTabPanel } from '@/lib/mobile-tabs/NonUnmountingTabPanel';
import { TabNavigationAction } from '@/lib/mobile-tabs/TabNavigationAction';

import { MobileTabContentWatcher, mobileTabHasContentState } from './tab-has-content';
import { TabConfig } from './tabs-config';

const bottomNavigationHeightPx = 56;
const handleMarginBlockPx = 15;
const bottomSheetHandleHeightPx = 2 * handleMarginBlockPx + 5;

type SnapPoint = string | number;
export const MobileBottomSheet: FC<{ tabsConfig: TabConfig[] }> = ({ tabsConfig }) => {
  const [bottomTabId, setBottomTabId] = useState(tabsConfig[0]?.id);

  const scrollRef = useRef<HTMLDivElement>(null);
  usePreventOverscroll(scrollRef);

  const snapPoints: SnapPoint[] = [
    `${bottomNavigationHeightPx + bottomSheetHandleHeightPx}px`,
    0.35,
    0.5,
    0.9, // calculation not supported here so leave roughly 10% for header
  ];

  const [activeSnapPoint, setActiveSnapPoint] = useState(snapPoints[1]);

  const scrollAreaHeight = `calc(100dvh - var(--snap-point-height) - ${bottomSheetHandleHeightPx + bottomNavigationHeightPx}px)`;
  return (
    <Drawer.Root
      defaultOpen={true}
      modal={false}
      dismissible={false}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      snapToSequentialPoint={false}
      handleOnly={true}
    >
      <Drawer.Portal>
        <Drawer.Content asChild={true}>
          <Box position="fixed" zIndex={1001} bottom={0} left={0} right={0}>
            <Paper
              elevation={3}
              square={true}
              sx={{
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
              }}
            >
              <Box pt={0.1} height="100dvh">
                <Drawer.Handle
                  style={{ marginBlock: `${handleMarginBlockPx}px`, width: '150px' }}
                />
                <div
                  style={{
                    height: scrollAreaHeight,
                    minHeight: scrollAreaHeight,
                    maxHeight: scrollAreaHeight,
                  }}
                >
                  <div
                    ref={scrollRef}
                    style={{
                      overflowY: 'scroll',
                      height: '100%',
                      overscrollBehavior: 'contain',
                    }}
                  >
                    <MobileBottomSheetTabContent tabsConfig={tabsConfig} selectedId={bottomTabId} />
                  </div>
                </div>
              </Box>
            </Paper>
          </Box>
        </Drawer.Content>
        <Box position="fixed" bottom={0} zIndex={6000} width="100%" sx={{ cursor: 'default' }}>
          <MobileBottomSheetTabNavigation
            tabsConfig={tabsConfig}
            selectedId={bottomTabId}
            setSelectedId={setBottomTabId}
          />
        </Box>
      </Drawer.Portal>
    </Drawer.Root>
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

/** Used to prevent pull-to-refresh gesture on mobile drawer when the drawer content is not scrollable
 * (because in those cases overscrollBehavior CSS property doesn't work)
 */
export const usePreventOverscroll = (scrollRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const isAtTop = scrollContainer.scrollTop === 0;

      const currentY = e.touches[0].clientY;
      const isSwipingDown = currentY > startY; // User is pulling down

      if (isAtTop && isSwipingDown) {
        e.preventDefault(); // Fully block pull-to-refresh
      }
    };

    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scrollRef]);
};
