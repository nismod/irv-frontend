import { LayersList } from 'deck.gl';
import { ReactNode } from 'react';

import { type D3 } from '@/lib/d3';
import { InteractionTarget } from '@/lib/data-map/interactions/types';
import { AccessorFunction } from '@/lib/deck/props/getters';

/** Current view layer params used in the app
 *
 * TODO: decouple the base ViewLayer from the app-specific view layer params
 */
export interface IrvViewLayerParams {
  selection?: InteractionTarget;
}

/**
 * Arguments for the view layer map render function.
 *
 * This serves as current map/application context that view layer code can read from.
 */
export type ViewLayerFunctionOptions<ViewLayerParamsT extends object> = {
  /** Custom deck.gl props passed to the layer from the app.
   *
   * Useful for setting basic properties such as `id`, `pickable` etc automatically.
   */
  deckProps: any;
  /** Current map zoom level. Allows zoom-dependent logic inside layers */
  zoom: number;
} & ViewLayerParamsT;

/** A single deck.gl layer, a falsey value, or a list of the above */
type ViewLayerMapLayers = LayersList[number];

/**
 * View layers are the main components of the data map application.
 *
 * One view layer usually corresponds to one dataset with its distinct characteristics and configuration.
 *
 * A view layer can render some deck.gl layers to the map, but it can also define
 * the rendering of several React UI slots such as the legend, tooltip, and selection details
 * for the layer.
 *
 * A view layer can belong to an interaction group, which determines the interactivity
 * of the layer.
 */
export interface ViewLayer<ParamsT = any> {
  /** Globally unique ID of the view layer */
  id: string;
  /** Store for arbitrary user data used to define this layer.
   * Can be accessed from code which renders tooltips etc
   */
  params?: ParamsT;

  /** ID of the interaction group this view layer belongs to */
  interactionGroup?: string;

  /** Function to render deck.gl map layers for this view layer
   * TODO: Decouple the abstract ViewLayer from the app-specific `IrvViewLayerParams` type
   */
  fn: (options: ViewLayerFunctionOptions<IrvViewLayerParams>) => ViewLayerMapLayers;

  /** Render a React tree for this view layer's legend */
  renderLegend?: () => ReactNode;
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
  renderTooltip?: (
    /** Hovered feature(s) to render details for */
    hover: InteractionTarget,
  ) => ReactNode;

  /** Render a React tree for this view layer's selection details */
  renderDetails?: (
    /**
     * Selected feature to render details for
     */
    selection: InteractionTarget,
  ) => ReactNode;

  /** The following properties are specific only to **VECTOR** layers
   *
   *  TODO: convert ViewLayer to a class and only leave universal functionality in the base class,
   *  moving functionality specific to just one data type into derived classes
   */

  /** Specification of mapping attribute data to feature style */
  styleParams?: StyleParams;
  /** Factory method that creates a deck.gl-compatible data accessor for the view layer, given a `FieldSpec` object */
  dataAccessFn?: ViewLayerDataAccessFunction;
  /** Factory method that creates a `FormatConfig` object for the view layer, given a `FieldSpec` object */
  dataFormatsFn?: ViewLayerDataFormatFunction;
}

/** The following types are specific to **VECTOR** layers   */

/** IRV vector data field specification */
export interface FieldSpec {
  fieldGroup: string;
  fieldDimensions?: any;
  field: string;
  fieldParams?: any;
}

/** Vector color scale specification */
export interface ColorSpec {
  scheme: (t: number) => string;
  scale: (
    domain: [number, number],
    interpolator: (t: number) => string,
  ) => D3.scale.ScaleSequential<any, any>;
  range: [number, number];
  empty: string;
  zeroIsEmpty?: boolean;
}

/** Specification for a mapping between a data field and a color scale */
export interface ColorMap {
  fieldSpec: FieldSpec;
  colorSpec: ColorSpec;
}

/** Style parameters for a vector data layer */
export interface StyleParams {
  /** How attributes should be mapped to feature color */
  colorMap?: ColorMap;

  // more mappings could be added here, e.g. sizeMap etc
}

/** Label / value formatting config for a vector data layer */
export interface FormatConfig<D = any> {
  /** Get a data label/title based on a vector data field spec */
  getDataLabel: (fieldSpec: FieldSpec) => string;
  /** Format a given value based on a vector data field spec*/
  getValueFormatted: (value: D, fieldSpec: FieldSpec) => string | ReactNode;
}

/** Produces a data accessor function, given a `FieldSpec` object */
export type ViewLayerDataAccessFunction = (fieldSpec: FieldSpec) => AccessorFunction<any>;

/** Produces a `FormatConfig` object, given a `FieldSpec` object */
export type ViewLayerDataFormatFunction = (fieldSpec: FieldSpec) => FormatConfig;
