import { Color, GeoJsonLayerProps } from 'deck.gl/typed';
import { Feature } from 'geojson';

import { Accessor } from './getters';
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

export type LineStyleProps = Pick<
  GeoJsonLayerProps,
  | 'lineJointRounded'
  | 'lineCapRounded'
  | 'lineWidthUnits'
  | 'getLineWidth'
  | 'lineWidthMinPixels'
  | 'lineWidthMaxPixels'
>;

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

export type PointStyleProps = Pick<
  GeoJsonLayerProps,
  'pointRadiusUnits' | 'getPointRadius' | 'pointRadiusMinPixels' | 'pointRadiusMaxPixels'
>;

export function pointRadius(zoom, level: ScaleLevel = 2): Partial<PointStyleProps> {
  return {
    pointRadiusUnits: 'meters' as const,
    ...pointSizeLevels[level],
  };
}

// export type Color = [number, number, number, number?];
export type GetColor = Accessor<Color, Feature>;

/**
 * Returns color with alpha set to new value.
 * Doesn't mutate the input color.
 * @param color (r,g,b,[a]) color to modify
 * @param alpha new alpha value
 */
export function setAlpha(color: Color, alpha: number): Color {
  const [r, g, b] = color;
  return [r, g, b, alpha];
}

const COLOR_PROPS = {
  fill: 'getFillColor',
  stroke: 'getLineColor',
} as const;

type ColorPropNameMap = typeof COLOR_PROPS;
type ColorPropKey = keyof ColorPropNameMap;

/**
 * deck.gl prop factory for vector color props
 */
function vectorColor<CT extends ColorPropKey>(
  type: CT,
  getColor: GetColor,
): PropsWithTriggers<ColorPropNameMap[CT], GetColor> {
  const propName = COLOR_PROPS[type];

  return {
    [propName]: getColor,
    updateTriggers: {
      [propName]:
        (getColor as any)?.updateTriggers ?? (typeof getColor === 'function' ? [] : undefined),
    },
  } as PropsWithTriggers<ColorPropNameMap[CT], GetColor>;
}

export const fillColor = (getColor: GetColor) => vectorColor('fill', getColor);
export const strokeColor = (getColor: GetColor) => vectorColor('stroke', getColor);

export function border(color: Color = [255, 255, 255]) {
  return {
    stroked: true,
    getLineColor: color,
    lineWidthMinPixels: 1,
  };
}
