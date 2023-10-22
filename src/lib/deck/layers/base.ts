import { BitmapLayer, GeoJsonLayer, MVTLayer, TileLayer } from 'deck.gl/typed';

import { ConfigTree } from '@/lib/nested-config/config-tree';
import { flattenConfig } from '@/lib/nested-config/flatten-config';
import {
  appendValue,
  composeAppendValue,
  makeObjectsMerger,
} from '@/lib/nested-config/merge-objects';

const mergeUpdateTriggers = makeObjectsMerger({
  renderSubLayers: appendValue,
});

/**
 * A set of strategies for merging compound layer properties
 * specific to Deck.GL
 */
const mergeDeckProps = makeObjectsMerger({
  updateTriggers: mergeUpdateTriggers,

  // concatenate extensions arrays
  extensions: appendValue,

  // concatenate the results of all `renderSubLayer` functions
  renderSubLayers: composeAppendValue,
});

/**
 * A function to merge multiple props objects passed to a Deck.GL layer.
 * This extends the base Deck.GL behaviour in a few ways:
 * - falsy elements of the array are ignored
 * - nested arrays are flattened
 * - compound props (currently only `updateTriggers`) are merged instead of overwritten
 */
function processDeckProps(...props: ConfigTree<object>): any {
  const flattenedProps = flattenConfig(props);

  return mergeDeckProps(...flattenedProps);
}

function wrap(deckClass) {
  return (...props) => new deckClass(processDeckProps(props));
}

export const mvtLayer = wrap(MVTLayer);
export const tileLayer = wrap(TileLayer);
export const bitmapLayer = wrap(BitmapLayer);
export const geoJsonLayer = wrap(GeoJsonLayer);
