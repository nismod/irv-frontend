import { ScaleSequential } from 'd3-scale';
import { ReactNode } from 'react';

import { DataLoader } from '@/lib/data-loader/data-loader';
import { InteractionTarget } from '@/lib/data-map/interactions/types';
import { AccessorFunction } from '@/lib/deck/props/getters';

export interface FieldSpec {
  fieldGroup: string;
  fieldDimensions?: any;
  field: string;
  fieldParams?: any;
}

export interface ColorSpec {
  scheme: (t: number, n: number) => string;
  scale: (
    domain: [number, number],
    interpolator: (t: number, n: number) => string,
  ) => ScaleSequential<any, any>;
  range: [number, number];
  empty: string;
  zeroIsEmpty?: boolean;
}
export interface ColorMap {
  fieldSpec: FieldSpec;
  colorSpec: ColorSpec;
}
export interface StyleParams {
  colorMap?: ColorMap;
}
export interface ViewLayerFunctionOptions {
  deckProps: any;
  zoom: number;
  selection?: InteractionTarget<any>;
}

export interface DataManager {
  getDataAccessor: (layer: string, fieldSpec: any) => (d: any) => any;
  getDataLoader: (layer: string, fieldSpec: any) => DataLoader;
}

export interface FormatConfig<D = any> {
  getDataLabel: (fieldSpec: FieldSpec) => string;
  getValueFormatted: (value: D, fieldSpec: FieldSpec) => string | ReactNode;
}

/** Produces a data accessor function, given a `FieldSpec` object */
export type ViewLayerDataAccessFunction = (fieldSpec: FieldSpec) => AccessorFunction<any>;

/** Produces a `FormatConfig` object, given a `FieldSpec` object */
export type ViewLayerDataFormatFunction = (fieldSpec: FieldSpec) => FormatConfig;

export type ViewLayerRenderLegendFunction = () => ReactNode;
export type ViewLayerRenderTooltipFunction = (
  /** Hovered feature(s) to render details for */
  hover: InteractionTarget,
) => ReactNode;

export type ViewLayerRenderDetailsFunction = (
  /**
   * Selected feature to render details for
   */
  selection: InteractionTarget,
) => ReactNode;

export interface ViewLayer<ParamsT = any> {
  id: string;
  params?: ParamsT;
  styleParams?: StyleParams;
  interactionGroup?: string;

  fn: (options: ViewLayerFunctionOptions) => any;

  /** Factory method that creates a deck.gl-compatible data accessor for the view layer, given a `FieldSpec` object */
  dataAccessFn?: ViewLayerDataAccessFunction;
  /** Factory method that creates a `FormatConfig` object for the view layer, given a `FieldSpec` object */
  dataFormatsFn?: ViewLayerDataFormatFunction;

  /** Render a React tree for this view layer's legend */
  renderLegend?: ViewLayerRenderLegendFunction;
  /**
   * String key based on which the layer legends will be grouped.
   * For all layers with the same legendKey, only one legend element will be rendered.
   *
   * If not defined, this defaults to the view layer's `id`, so each layer will by default render its own legend.
   *
   * Currently, the first layer in the group will be responsible for rendering the legend for all other layers.
   * The key needs to be set in layers so that the one legend rendered for the group will represent all layers correctly.
   *
   * For example, if two layers use the same color scale for data visualisation, but the numerical range of the data is different,
   * the layers should have a different legendKey - otherwise, the single legend would display min/max values that would correctly represent
   * only one of the layers.
   */
  legendKey?: string;

  /** Render a React tree for this view layer's tooltip.*/
  renderTooltip?: ViewLayerRenderTooltipFunction;
  renderDetails?: ViewLayerRenderDetailsFunction;
}

export function viewOnlyLayer(id, fn): ViewLayer {
  return {
    id,
    interactionGroup: null,
    fn,
  };
}

export interface ViewLayerParams {
  selection?: any;
}
