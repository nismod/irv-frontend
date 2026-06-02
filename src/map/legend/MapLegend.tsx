import { useAtomValue } from 'jotai';
import { FC, Suspense } from 'react';

import { useLegendConfigMap } from '@/lib/data-map/legend/legend-config-map';
import { LegendStack } from '@/lib/data-map/legend/LegendStack';
import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';

import { viewLayersAtom } from '@/state/layers/view-layers';

export const MapLegendContent: FC = () => {
  const viewLayers = useAtomValue(viewLayersAtom);
  const legendConfigs = useLegendConfigMap(viewLayers);

  if (!legendConfigs) {
    return null;
  }

  return (
    <>
      <ContentWatcher />
      <LegendStack legendConfigs={legendConfigs} />
    </>
  );
};

export const MapLegend: FC = () => (
  <Suspense fallback={null}>
    <MapLegendContent />
  </Suspense>
);
