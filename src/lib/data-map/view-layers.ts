import { ScaleSequential } from 'd3-scale';
import { ReactNode } from 'react';

import { DataLoader } from '@/lib/data-loader/data-loader';
import { InteractionTarget } from '@/lib/data-map/interactions/types';
import { Accessor } from '@/lib/deck/props/getters';

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

export type ViewLayerDataAccessFunction = (fieldSpec: FieldSpec) => Accessor<any>;
export type ViewLayerDataFormatFunction = (fieldSpec: FieldSpec) => FormatConfig;

export type ViewLayerRenderLegendFunction = () => ReactNode;
export type ViewLayerRenderTooltipFunction = (hover: any) => ReactNode;
export type ViewLayerRenderDetailsFunction = (selection: any) => ReactNode;

export interface ViewLayer<ParamsT = any> {
  id: string;
  params?: ParamsT;
  styleParams?: StyleParams;
  fn: (options: ViewLayerFunctionOptions) => any;
  dataAccessFn?: ViewLayerDataAccessFunction;
  dataFormatsFn?: ViewLayerDataFormatFunction;
  interactionGroup?: string;

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
