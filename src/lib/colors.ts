import * as d3 from 'd3-color';
import { Color } from 'deck.gl/typed';
import _ from 'lodash';

export function colorCssToRgb(cssColor: string): Color {
  const color = d3.color(cssColor);
  const { r, g, b } = color.rgb();
  const a = color.opacity;
  return a === 1 ? [r, g, b] : [r, g, b, a * 256];
}

/**
 * Convert css color representation to [r,g,b,a?] deck.gl-style array.
 *
 * The `$M` suffix indicates this function is memoized.
 */
export const css2rgba$M = _.memoize(colorCssToRgb);

/**
 * Creates a color object with css and deck.gl format from CSS string
 * @param c color in CSS string format
 * @returns object with both css and deck color formats
 */
export function makeColor(c: string) {
  return { css: c, deck: colorCssToRgb(c) };
}
