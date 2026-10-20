import type { MapLibreOverlay } from '@deck.gl/maplibre';
import type { PickingInfo } from 'deck.gl';
import { useSetAtom } from 'jotai';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { useSyncValueToAtom } from '@/lib/jotai/state-sync/use-sync-state';
import { useSetAtomFamily } from '@/lib/jotai/use-set-atom-family';

import {
  allowedGroupLayersAtom,
  hoverAtomFamily,
  hoverPositionAtom,
  selectionAtomFamily,
} from './interaction-state';
import { processPicked } from './process-picked';
import { RasterReadbackPool } from './raster-readback';
import { InteractionGroupConfig, InteractionTarget } from './types';

/**
 * Default picking radius used in case ther eis no interactions groups defined
 */
const DEFAULT_PICKING_RADIUS = 8;

/**
 * Based on view layers and interaction groups, returns props to pass to deck.gl for handling click / hover, layer pass filter etc
 */
export function useInteractions(
  /** Array of all view layers in the application */
  viewLayers: ViewLayer[],
  /** Function to get view layer ID for a deck layer ID */
  lookupViewForDeck: (deckLayerId: string) => string,
  /** Array of interaction group configs */
  interactionGroups: InteractionGroupConfig[],
  /** Default picking radius to use when no interaction group is present */
  defaultPickingRadius: number = DEFAULT_PICKING_RADIUS,
) {
  const setHoverAnchor = useSetAtom(hoverPositionAtom);

  const setInteractionGroupHover = useSetAtomFamily(hoverAtomFamily);
  const setInteractionGroupSelection = useSetAtomFamily(selectionAtomFamily);

  const interactionGroupLookup = useMemo(
    () => _.keyBy(interactionGroups, (group) => group.id),
    [interactionGroups],
  );

  const primaryGroup = interactionGroups[0]?.id;
  // TODO: improve the choice of pickingRadius to return, so that it's not dependent on group order
  const primaryGroupPickingRadius =
    (primaryGroup && interactionGroupLookup[primaryGroup].pickingRadius) ?? defaultPickingRadius;

  /** Interaction groups included in deck's automatic hover picking pass. */
  const hoverPassGroups = useMemo(
    () =>
      new Set(
        interactionGroups
          .filter((group) => group.id === primaryGroup || group.usesAutoHighlight)
          .map((group) => group.id),
      ),
    [interactionGroups, primaryGroup],
  );

  /** all view layers that have an interaction group set = are interactive */
  const interactiveLayers = useMemo(
    () => viewLayers.filter((x) => x.interactionGroup),
    [viewLayers],
  );

  /** view layer lookup by id */
  const viewLayerLookup = useMemo(
    () => _.keyBy(interactiveLayers, (layer) => layer.id),
    [interactiveLayers],
  );

  /** allowed view layer ids per interaction group */
  const activeGroupLayerIds = useMemo(
    () =>
      _(interactiveLayers)
        .groupBy((viewLayer) => viewLayer.interactionGroup)
        .mapValues((viewLayers) => viewLayers.map((viewLayer) => viewLayer.id))
        .value(),
    [interactiveLayers],
  );

  useSyncValueToAtom(activeGroupLayerIds, allowedGroupLayersAtom);

  const hoverRequest = useRef(0);
  const clickRequest = useRef(0);
  const readbackPool = useRef<RasterReadbackPool | null>(null);
  const hoverQueue = useRef<{
    pending: (() => Promise<void>) | null;
    running: Promise<void> | null;
  }>({ pending: null, running: null });

  useEffect(() => {
    const pool = (readbackPool.current ??= new RasterReadbackPool());
    return () => {
      pool.destroy();
      readbackPool.current = null;
    };
  }, []);

  const processHover = useCallback(
    async (info: any, deck: MapLibreOverlay, request: number) => {
      const { x, y } = info;
      const hoveredViewLayerId = info.picked && info.layer && lookupViewForDeck(info.layer.id);
      const hoveredGroup = viewLayerLookup[hoveredViewLayerId]?.interactionGroup;
      const batch = (readbackPool.current ??= new RasterReadbackPool()).createBatch();

      const groupTasks = Object.entries(activeGroupLayerIds).map(async ([groupName, layerIds]) => {
        try {
          const { type, pickingRadius: radius, pickMultiple } = interactionGroupLookup[groupName];

          const pickingParams = { x, y, layerIds, radius };

          // Explicit queries default to radius 0; automatic hover uses the
          // primary group's radius and only includes hoverPassGroups.
          const groupRadius = radius ?? 0;
          const coveredByHover = hoverPassGroups.has(groupName);
          let pickedObjects: PickingInfo[];
          if (coveredByHover && info.picked === false && groupRadius <= primaryGroupPickingRadius) {
            pickedObjects = [];
          } else if (
            coveredByHover &&
            !pickMultiple &&
            hoveredGroup === groupName &&
            groupRadius === primaryGroupPickingRadius
          ) {
            pickedObjects = [info];
          } else {
            pickedObjects = pickMultiple
              ? deck.pickMultipleObjects(pickingParams)
              : [deck.pickObject(pickingParams)];
          }

          // Wait for every readback, including when a sibling readback fails,
          // before allowing the next hover batch to start.
          const results = await Promise.allSettled(
            pickedObjects.map(
              (info) =>
                info &&
                processPicked(info, type, groupName, viewLayerLookup, lookupViewForDeck, batch),
            ),
          );
          const failure = results.find((result) => result.status === 'rejected');
          if (failure?.status === 'rejected') {
            throw failure.reason;
          }
          const interactionTargets: InteractionTarget[] = results.flatMap((result) =>
            result.status === 'fulfilled' && result.value ? [result.value] : [],
          );

          if (request === hoverRequest.current) {
            setInteractionGroupHover(groupName, interactionTargets);
          }
        } catch (error) {
          if (request === hoverRequest.current) {
            setInteractionGroupHover(groupName, []);
            console.warn('Unable to process map hover', error);
          }
        }
      });
      // Every group queues its copies synchronously before awaiting their results.
      batch.submit();
      await Promise.all(groupTasks);
    },
    [
      activeGroupLayerIds,
      lookupViewForDeck,
      interactionGroupLookup,
      hoverPassGroups,
      primaryGroupPickingRadius,
      setInteractionGroupHover,
      viewLayerLookup,
    ],
  );

  const onHover = useCallback(
    (info: any, deck: MapLibreOverlay) => {
      const request = ++hoverRequest.current;
      const { coordinate } = info;
      setHoverAnchor(coordinate ? { lng: coordinate[0], lat: coordinate[1] } : null);

      const queue = hoverQueue.current;
      // Replace queued work rather than accumulating readbacks as the pointer moves.
      queue.pending = () => processHover(info, deck, request);
      if (!queue.running) {
        queue.running = (async () => {
          try {
            while (queue.pending) {
              const next = queue.pending;
              queue.pending = null;
              await next();
            }
          } finally {
            queue.running = null;
          }
        })();
      }
      return queue.running;
    },
    [processHover, setHoverAnchor],
  );

  const onClick = useCallback(
    async (info: any, deck: MapLibreOverlay) => {
      const request = ++clickRequest.current;
      const { x, y } = info;
      for (const [groupName, layerIds] of Object.entries(activeGroupLayerIds)) {
        const interactionGroup = interactionGroupLookup[groupName];
        const { type, pickingRadius: radius, deselectOnClickEmpty = true } = interactionGroup;

        // currently only supports selecting vector features
        if (interactionGroup.type === 'vector') {
          const info = deck.pickObject({ x, y, layerIds, radius });
          if (info == null && !deselectOnClickEmpty) {
            // if no object was picked and we should not deselect, skip processing
            continue;
          }
          const selectionTarget =
            info &&
            (await processPicked(info, type, groupName, viewLayerLookup, lookupViewForDeck));

          if (request === clickRequest.current) {
            setInteractionGroupSelection(groupName, selectionTarget);
          }
        }
      }
    },
    [
      activeGroupLayerIds,
      lookupViewForDeck,
      interactionGroupLookup,
      setInteractionGroupSelection,
      viewLayerLookup,
    ],
  );

  // Discard pending results when the interaction configuration changes or the map unmounts.
  useEffect(
    () => () => {
      hoverRequest.current++;
      clickRequest.current++;
      hoverQueue.current.pending = null;
    },
    [onHover, onClick],
  );

  const layerFilter = ({ layer: deckLayer, renderPass }) => {
    if (renderPass === 'picking:hover') {
      const viewLayerId = lookupViewForDeck(deckLayer.id);
      const interactionGroup = viewLayerId && viewLayerLookup[viewLayerId]?.interactionGroup;

      return interactionGroup ? hoverPassGroups.has(interactionGroup) : false;
    }
    return true;
  };

  return {
    onHover,
    onClick,
    layerFilter,
    pickingRadius: primaryGroupPickingRadius,
  };
}
