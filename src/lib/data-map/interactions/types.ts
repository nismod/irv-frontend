import { ViewLayer } from '../view-layers';

export type InteractionStyle = 'vector' | 'raster';

/** Configuration of an interaction group for the data map */
export interface InteractionGroupConfig {
  /** Unique ID of the group */
  id: string;
  /** Style of interaction (currently: raster/vector)  */
  type: InteractionStyle;
  /** Picking radius to use for deck.gl. NOTE: only the primary interaction group affects the picking radius. */
  pickingRadius?: number;
  /** Should multiple picked targets be returned for an interaction?
   * For example, points from all raster layers in this interaction group,
   * that are currently under the cursor.
   **/
  pickMultiple?: boolean;
  /** Do the layers in this interaction group use deck.gl's autoHighlight feature? */
  usesAutoHighlight?: boolean;
}

/** Data for an interaction target with a raster layer */
export interface RasterTarget {
  /** Color of the interaction point (in [r,g,b,a] format, each value 0-255) */
  color: [number, number, number, number];
}

/** Data for an interaction target with a vector layer */
export interface VectorTarget {
  /** Vector feature at the interaction point */
  feature: any;
}

/** Result of a map interaction with a single view layer */
export interface InteractionTarget<T = any> {
  /** View layer with which the user interacted */
  viewLayer: ViewLayer;
  /** ID of the deck.gl layer with which the user interacted */
  deckLayerId: string;

  /** Data for the interaction target */
  target: T;
}
