import {
  BitmapLayer,
  BitmapLayerProps,
  GeoJsonLayer,
  GeoJsonLayerProps,
  MVTLayer,
  MVTLayerProps,
  TileLayer,
  TileLayerProps,
} from 'deck.gl/typed';

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

/** Type for a `...props` arguments of a layer factory function */
export type MultiProps<PropsT> = ConfigTree<Partial<PropsT>>;

export type LayerFactory<LayerT, LayerProps> = (
  ...props: ConfigTree<Partial<LayerProps>>
) => LayerT;

/**
 * **NOTE**: Need to wrap all layers manually to preserve structure of template parameters
 */

/**
 * MVTLayer with advanced prop merging
 */
export const mvtLayer = <ExtraPropsT extends {} = {}>(
  ...props: MultiProps<MVTLayerProps & ExtraPropsT>
) => new MVTLayer<ExtraPropsT>(processDeckProps(props));

/**
 * TileLayer with advanced prop merging
 */
export const tileLayer = <DataT = any, ExtraPropsT extends {} = {}>(
  ...props: MultiProps<TileLayerProps<DataT> & ExtraPropsT>
) => new TileLayer<DataT, ExtraPropsT>(processDeckProps(props));

/**
 * BitmapLayer with advanced prop merging
 */
export const bitmapLayer = <ExtraPropsT extends {} = {}>(
  ...props: MultiProps<BitmapLayerProps & ExtraPropsT>
) => new BitmapLayer<ExtraPropsT>(processDeckProps(props));

/**
 * GeoJsonLayer with advanced prop merging
 */
export const geoJsonLayer = <ExtraPropsT extends {} = {}>(
  ...props: MultiProps<GeoJsonLayerProps & ExtraPropsT>
) => new GeoJsonLayer<ExtraPropsT>(processDeckProps(props));
