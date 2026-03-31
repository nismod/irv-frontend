import Box from '@mui/material/Box';
import { MapViewState } from 'deck.gl';
import { FC, ReactNode, Suspense, useState } from 'react';
import { RecoilRoot } from 'recoil';

import { BaseMap } from '@/lib/data-map/BaseMap';
import { DataMap } from '@/lib/data-map/DataMap';
import { DataMapTooltip } from '@/lib/data-map/DataMapTooltip';
import { InteractionGroupConfig } from '@/lib/data-map/interactions/types';
import { AutoHidePaper, PreventHide } from '@/lib/data-map/tooltip/auto-hide';
import { InteractionGroupTooltip } from '@/lib/data-map/tooltip/InteractionGroupTooltip';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { MapHudAttributionControl, MapHudNavigationControl } from '@/lib/map/hud/mapbox-controls';
import { MapHud } from '@/lib/map/hud/MapHud';
import { MapHudRegion } from '@/lib/map/hud/MapHudRegion';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';
import { withProps } from '@/lib/react/with-props';

import { useBasemapStyle } from '@/map/use-basemap-style';

import { ArticleMapCollapsibleLegend } from './ArticleMapCollapsibleLegend';

const TooltipSection = ({ children }: { children?: ReactNode }) =>
  children ? (
    <Box px={1} py={0.5} borderBottom="1px solid #ccc">
      <PreventHide />
      {children}
    </Box>
  ) : null;

const InteractionGroupTooltipWrapped = withProps(InteractionGroupTooltip, {
  WrapperComponent: TooltipSection,
});

/** Mirrors `map/tooltip/TooltipContent.tsx`: one section per group; WDPA uses merged hover UI. */
const ArticleMapTooltipContent: FC<{ interactionGroups: InteractionGroupConfig[] }> = ({
  interactionGroups,
}) => (
  <AutoHidePaper>
    <Box minWidth={200}>
      <ErrorBoundary message="There was a problem displaying the tooltip.">
        {interactionGroups.map((group) => (
          <InteractionGroupTooltipWrapped key={group.id} group={group.id} />
        ))}
      </ErrorBoundary>
    </Box>
  </AutoHidePaper>
);

export interface ArticleMapProps {
  viewLayers: ViewLayer[];
  /** Per-view-layer params passed through to each layer's `fn` (e.g. selection). */
  viewLayersParams?: Record<string, unknown>;
  /**
   * When non-empty, enables picking/hover like the main map and shows `DataMapTooltip`
   * content (one `InteractionGroupTooltip` per group). Layer `interactionGroup` ids must match.
   */
  interactionGroups?: InteractionGroupConfig[];
  /** Pixel height of the map container (default 400). */
  height?: number | string;
  /** Initial camera; map is uncontrolled after mount. */
  initialViewState?: Partial<MapViewState>;
  /** Children to render inside the map container (e.g. `MapMarker`). */
  children?: ReactNode;
}

function defaultViewState(overrides?: Partial<MapViewState>): MapViewState {
  return {
    // London coordinates
    latitude: 51.5074,
    longitude: -0.1278,
    zoom: 3,
    pitch: 0,
    bearing: 0,
    minZoom: 0,
    maxZoom: 14,
    minPitch: 0,
    maxPitch: 0,
    ...overrides,
  };
}

const ArticleMapAttributionControl = withProps(MapHudAttributionControl, {
  customAttribution:
    'Background map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, style &copy; <a href="https://carto.com/attributions">CARTO</a>.',
  compact: true,
});

const ArticleMapNavigationControl = withProps(MapHudNavigationControl, {
  showCompass: false,
});

/**
 * DataMap embed for narrative articles: nested Recoil store so interaction state
 * does not touch the main app map. Basemap style matches the app's light raster.
 * Wrap with `ArticleFigure` for title and caption.
 */
const ArticleMapInner: FC<ArticleMapProps> = ({
  viewLayers,
  viewLayersParams = {},
  interactionGroups = [],
  height = 400,
  initialViewState,
  children,
}) => {
  const [viewState, setViewState] = useState<MapViewState>(() =>
    defaultViewState(initialViewState),
  );

  const { mapStyle, firstLabelId } = useBasemapStyle('light', false);

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <BaseMap
        mapStyle={mapStyle}
        viewState={viewState}
        onViewState={setViewState}
        // prevents issues with multiple maps on article pages
        reuseMaps={false}
      >
        <DataMap
          beforeId={firstLabelId}
          viewLayers={viewLayers}
          viewLayersParams={viewLayersParams as Record<string, any>}
          interactionGroups={interactionGroups}
        />
        {interactionGroups.length > 0 ? (
          <DataMapTooltip>
            {/* Isolate async colormap (tooltip) from outer Suspense so basemap/Deck stay mounted during hover */}
            <Suspense fallback={null}>
              <ArticleMapTooltipContent interactionGroups={interactionGroups} />
            </Suspense>
          </DataMapTooltip>
        ) : null}
        {children}
        <MapHud>
          <MapHudRegion position="bottom-left">
            <ArticleMapCollapsibleLegend viewLayers={viewLayers} />
          </MapHudRegion>
          <MapHudRegion position="top-right">
            <ArticleMapNavigationControl />
          </MapHudRegion>
          <MapHudRegion position="bottom-right">
            <ArticleMapAttributionControl />
          </MapHudRegion>
        </MapHud>
      </BaseMap>
    </div>
  );
};

/**
 * Wrapped in `RecoilRoot` + `Suspense` for async basemap style only; tooltip has its own `Suspense`
 * so raster colormap loading does not unmount the map.
 */
export const ArticleMap: FC<ArticleMapProps> = (props) => (
  <RecoilRoot>
    <Suspense fallback={null}>
      <ErrorBoundary message="There was a problem displaying this map.">
        <ArticleMapInner {...props} />
      </ErrorBoundary>
    </Suspense>
  </RecoilRoot>
);
