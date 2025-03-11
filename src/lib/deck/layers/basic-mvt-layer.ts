import { MVTLayerProps } from 'deck.gl';

import { geoJsonLayer, MultiProps, mvtLayer } from './base';
import { Tileset2DCentered } from './tileset-2d-centered';

/**
 * An MVT layer with some sensible default props.
 *
 * Loads tiles from view center, sets auto-highlight, refinement strategy.
 * Renders tiles as GeoJsonLayer.
 *
 * @param props multiple prop objects to add to layer
 */
export function basicMvtLayer<ExtraPropsT extends {} = {}>(
  ...props: MultiProps<MVTLayerProps | ExtraPropsT>
) {
  return mvtLayer(
    {
      // override tileset to load tiles from viewport center
      TilesetClass: Tileset2DCentered,

      // default auto-highlight
      autoHighlight: true,
      highlightColor: [0, 255, 255, 255],

      // default refinement strategy
      refinementStrategy: 'best-available',

      // render tiles as GeoJsonLayer by default
      /**
       * NOTE: this is the same as default, but assuming that there is a merge strategy for `renderSubLayers`,
       * this prop will be merged by appending the results of all supplied `renderSubLayer` functions.
       * So the standard geojson sublayer will be combined with other sublayers specified through `props`
       */
      renderSubLayers: (tileProps) => geoJsonLayer(tileProps),
    },
    props,
  );
}
