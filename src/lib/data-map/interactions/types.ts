import { ViewLayer } from '../view-layers';

export type InteractionStyle = 'vector' | 'raster';

export interface InteractionGroupConfig {
  id: string;
  type: InteractionStyle;
  pickingRadius?: number;
  pickMultiple?: boolean;
  usesAutoHighlight?: boolean;
}

export interface RasterTarget {
  color: [number, number, number, number];
}

export interface VectorTarget {
  feature: any;
}

export interface InteractionTarget<T = any> {
  interactionGroup: string;
  interactionStyle: string;

  viewLayer: ViewLayer;
  deckLayerId: string;

  target: T;
}
