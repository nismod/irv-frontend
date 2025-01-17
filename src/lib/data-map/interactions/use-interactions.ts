import type { MapboxOverlay } from '@deck.gl/mapbox/typed';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { useSyncValueToRecoil } from '@/lib/recoil/state-sync/use-sync-state';
import { useSetRecoilStateFamily } from '@/lib/recoil/use-set-recoil-state-family';

import {
  allowedGroupLayersState,
  hoverPositionState,
  hoverState,
  selectionState,
} from './interaction-state';
import { processPicked } from './process-picked';
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
  const setHoverXY = useSetRecoilState(hoverPositionState);

  const setInteractionGroupHover = useSetRecoilStateFamily(hoverState);
  const setInteractionGroupSelection = useSetRecoilStateFamily(selectionState);

  const interactionGroupLookup = useMemo(
    () => _.keyBy(interactionGroups, (group) => group.id),
    [interactionGroups],
  );

  const primaryGroup = interactionGroups[0]?.id;
  // TODO: improve the choice of pickingRadius to return, so that it's not dependent on group order
  const primaryGroupPickingRadius =
    (primaryGroup && interactionGroupLookup[primaryGroup].pickingRadius) ?? defaultPickingRadius;

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

  useSyncValueToRecoil(activeGroupLayerIds, allowedGroupLayersState);

  const onHover = useCallback(
    (info: any, deck: MapboxOverlay) => {
      const { x, y } = info;

      for (const [groupName, layerIds] of Object.entries(activeGroupLayerIds)) {
        const { type, pickingRadius: radius, pickMultiple } = interactionGroupLookup[groupName];

        const pickingParams = { x, y, layerIds, radius };

        const pickedObjects = pickMultiple
          ? deck.pickMultipleObjects(pickingParams)
          : [deck.pickObject(pickingParams)];

        const interactionTargets: InteractionTarget[] = pickedObjects
          .map(
            (info) =>
              info && processPicked(info, type, groupName, viewLayerLookup, lookupViewForDeck),
          )
          .filter(Boolean);

        setInteractionGroupHover(groupName, interactionTargets);
      }

      setHoverXY([x, y]);
    },
    [
      activeGroupLayerIds,
      lookupViewForDeck,
      interactionGroupLookup,
      setHoverXY,
      setInteractionGroupHover,
      viewLayerLookup,
    ],
  );

  const onClick = useCallback(
    (info: any, deck: MapboxOverlay) => {
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
          let selectionTarget =
            info && processPicked(info, type, groupName, viewLayerLookup, lookupViewForDeck);

          setInteractionGroupSelection(groupName, selectionTarget);
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

  /**
   * Interaction groups which should be rendered during the hover picking pass
   */
  const hoverPassGroups = useMemo(
    () =>
      new Set(
        _.filter(
          interactionGroups,
          (group) => group.id === primaryGroup || group.usesAutoHighlight,
        ).map((group) => group.id),
      ),
    [interactionGroups, primaryGroup],
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
