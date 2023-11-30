import type { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { FC, useCallback, useMemo, useRef } from 'react';
import { useMap } from 'react-map-gl/maplibre';

import { useTriggerMemo } from '../hooks/use-trigger-memo';
import { DeckGLOverlay } from '../map/DeckGLOverlay';
import { InteractionGroupConfig } from './interactions/types';
import { useInteractions } from './interactions/use-interactions';
import { useDataLoadTrigger } from './use-data-load-trigger';
import { ViewLayer } from './view-layers';

export interface DataMapProps {
  /** ID of the react-map-gl layer before which the deck.gl layers should be inserted */
  beforeId: string | undefined;
  /** Array of all view layers */
  viewLayers: ViewLayer[];
  /** Lookup of view layer params by layer ID */
  viewLayersParams: Record<string, any>;
  /** Array of interaction group configs */
  interactionGroups: InteractionGroupConfig[];
}

/** Sets a convention where the view layer ID is either the first part of the deck ID before the `@` sign,
 *  or it's the whole ID if there's not `@` sign
 */
function lookupViewForDeck(deckLayerId: string) {
  return deckLayerId.split('@')[0];
}

/**
 * Main data map component - processes the config: view layers, view layer params, interaction groups
 * - and displays a DeckGLOverlay with layers representing the data.
 *
 * Handles view layer interactions and external data loading.
 */
export const DataMap: FC<DataMapProps> = ({
  beforeId,
  viewLayers,
  viewLayersParams,
  interactionGroups,
}) => {
  const { onHover, onClick, layerFilter, pickingRadius } = useInteractions(
    viewLayers,
    lookupViewForDeck,
    interactionGroups,
  );

  const dataLoaders = useMemo(
    () =>
      viewLayers
        .map((vl) => vl.dataAccessFn?.(vl.styleParams?.colorMap?.fieldSpec)?.dataLoader)
        .filter(Boolean),
    [viewLayers],
  );

  const dataLoadTrigger = useDataLoadTrigger(dataLoaders);

  /** Function called every time the map zoom changes, to calculate new list of deck layers */
  const layersFunction = useCallback(
    ({ zoom }: { zoom: number }) =>
      viewLayers.map((viewLayer) =>
        makeDeckLayers(viewLayer, viewLayersParams[viewLayer.id], zoom, beforeId),
      ),
    [beforeId, viewLayers, viewLayersParams],
  );

  const deckRef = useRef<MapboxOverlay>();

  const { current: map } = useMap();
  const zoom = map.getMap().getZoom();

  /**
   * List of deck.gl layers, recalculated upon zoom change,
   * but also when `dataLoadTrigger` changes - because deck.gl can't detect a change to external data
   */
  const layers = useTriggerMemo(
    () => layersFunction({ zoom }),
    [layersFunction, zoom],
    dataLoadTrigger,
  );

  return (
    <DeckGLOverlay
      interleaved={true}
      ref={deckRef}
      style={{
        overflow: 'hidden',
      }}
      getCursor={() => 'default'}
      layers={layers}
      layerFilter={layerFilter}
      onHover={(info) => deckRef.current && onHover?.(info, deckRef.current)}
      onClick={(info) => deckRef.current && onClick?.(info, deckRef.current)}
      pickingRadius={pickingRadius}
    />
  );
};

/** Utility function to create deck layers for a list of view layers */
function makeDeckLayers(
  viewLayer: ViewLayer,
  viewLayerParams: any,
  zoom: number,
  beforeId: string | undefined,
) {
  return viewLayer.fn({
    deckProps: {
      id: viewLayer.id, // by default set deck layer ID to view layer ID. View layers can override this
      pickable: !!viewLayer.interactionGroup, // automatically set layer to pickable or not, depending on whether it specifies an interaction group
      beforeId,
    },
    zoom,
    ...viewLayerParams,
  });
}
