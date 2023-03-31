import { Color, GeoJsonLayerProps } from 'deck.gl/typed';
import { Feature } from 'geojson';

import { Accessor, getTriggers } from './getters';
import type { PropsWithTriggers } from './types';

type ScaleLevel = 0 | 1 | 2;

const lineSizeLevels: Record<
  ScaleLevel,
  {
    getLineWidth: number;
    lineWidthMinPixels: number;
    lineWidthMaxPixels: number;
  }
> = {
  0: {
    getLineWidth: 90,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 7,
  },
  1: {
    getLineWidth: 60,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 6,
  },
  2: {
    getLineWidth: 20,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 5,
  },
};

/**
 * GeoJsonLayer line style props
 */
export type LineStyleProps = Pick<
  GeoJsonLayerProps,
  | 'lineJointRounded'
  | 'lineCapRounded'
  | 'lineWidthUnits'
  | 'getLineWidth'
  | 'lineWidthMinPixels'
  | 'lineWidthMaxPixels'
>;

/**
 * deck.gl prop factory for GeojsonLayer line width/style props
 */
export function lineStyle(zoom, level: ScaleLevel = 2): Partial<LineStyleProps> {
  return {
    lineJointRounded: true,
    lineCapRounded: true,
    lineWidthUnits: 'meters' as const,

    ...lineSizeLevels[level],

    // widthScale: 2 ** (15 - zoom),
  };
}

const pointSizeLevels: Record<
  ScaleLevel,
  {
    getPointRadius: number;
    pointRadiusMinPixels: number;
    pointRadiusMaxPixels: number;
  }
> = {
  0: { getPointRadius: 1500, pointRadiusMinPixels: 3, pointRadiusMaxPixels: 6 },
  1: { getPointRadius: 1200, pointRadiusMinPixels: 2, pointRadiusMaxPixels: 4 },
  2: { getPointRadius: 300, pointRadiusMinPixels: 2, pointRadiusMaxPixels: 4 },
};

/**
 * GeoJsonLayer point style props
 */
export type PointStyleProps = Pick<
  GeoJsonLayerProps,
  'pointRadiusUnits' | 'getPointRadius' | 'pointRadiusMinPixels' | 'pointRadiusMaxPixels'
>;

/**
 * deck.gl prop factory for GeojsonLayer point radius props
 */
export function pointRadius(zoom, level: ScaleLevel = 2): Partial<PointStyleProps> {
  return {
    pointRadiusUnits: 'meters' as const,
    ...pointSizeLevels[level],
  };
}

/**
 * GeoJsonLayer icon style props
 */
export type IconStyleProps = Pick<
  GeoJsonLayerProps,
  'iconSizeUnits' | 'getIconSize' | 'iconSizeMinPixels' | 'iconSizeMaxPixels'
>;

/**
 * deck.gl prop factory for GeojsonLayer icon size props
 */
export function iconSize(zoom: number, level: ScaleLevel = 2): Partial<IconStyleProps> {
  const { getPointRadius, pointRadiusMinPixels, pointRadiusMaxPixels } = pointSizeLevels[level];

  return {
    iconSizeUnits: 'meters',
    getIconSize: getPointRadius * 2,
    iconSizeMinPixels: pointRadiusMinPixels * 2,
    iconSizeMaxPixels: pointRadiusMaxPixels * 2,
  };
}

export type GetColor = Accessor<Color, Feature>;

const COLOR_PROPS = {
  fill: 'getFillColor',
  stroke: 'getLineColor',
  icon: 'getIconColor',
} as const;

type ColorPropNameMap = typeof COLOR_PROPS;
type ColorPropKey = keyof ColorPropNameMap;

/**
 * deck.gl prop factory for vector color props
 *
 * **NOTE**: relies on a merge strategy for `updateTriggers` to be defined
 */
function vectorColor<CT extends ColorPropKey>(
  type: CT,
  getColor: GetColor,
): PropsWithTriggers<ColorPropNameMap[CT], GetColor> {
  const propName = COLOR_PROPS[type];

  return {
    [propName]: getColor,
    updateTriggers: {
      [propName]: getTriggers(getColor),
    },
  } as PropsWithTriggers<ColorPropNameMap[CT], GetColor>;
}

/**
 * deck.gl prop factory for vector fill color props
 */
export const fillColor = (getColor: GetColor) => vectorColor('fill', getColor);

/**
 * deck.gl prop factory for vector stroke color props
 */
export const strokeColor = (getColor: GetColor) => vectorColor('stroke', getColor);

/**
 * deck.gl prop factory for vector icon color props
 */
export const iconColor = (getColor: GetColor) => vectorColor('icon', getColor);

/**
 * deck.gl prop factory for vector border stroke/color props
 */
export function border(color: Color = [255, 255, 255]) {
  return {
    stroked: true,
    getLineColor: color,
    lineWidthMinPixels: 1,
  };
}
