import { Color } from 'deck.gl';

/**
 * Returns color with alpha set to new value.
 * Doesn't mutate the input color.
 * @param color (r,g,b,[a]) color to modify
 * @param alpha new alpha value
 */

export function withAlpha(color: Color, alpha: number): Color {
  const [r, g, b] = color;
  return [r, g, b, alpha];
}

/**
 * Returns deck.gl color without alpha.
 * Doesn't mutate the input color.
 * @param color (r,g,b,[a]) color to modify
 * @returns (r,g,b) color without alpha
 */
export function withoutAlpha(color: Color): Color {
  const [r, g, b] = color;
  return [r, g, b];
}
