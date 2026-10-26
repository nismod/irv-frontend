import { describe, expect, it } from 'vitest';

import { roundValueRange } from '@/lib/value-range';

import { makeRasterValueRangeLookup } from './raster-value-range';

const palette = [
  { value: 0, color: 'a' },
  { value: 10, color: 'b' },
  { value: 20, color: 'c' },
];

describe('raster color uncertainty', () => {
  it('uses midpoint boundaries between neighboring palette values', () => {
    const lookup = makeRasterValueRangeLookup(palette);
    expect(lookup.get('b')).toMatchObject({ min: 5, max: 15 });
    expect(lookup.get('a')).toMatchObject({ min: 0, max: 5 });
    expect(lookup.get('c')).toMatchObject({ min: 15, max: 20 });
  });

  it('includes all matching bins when the palette repeats a color', () => {
    const lookup = makeRasterValueRangeLookup([
      ...palette,
      { value: 30, color: 'b' },
      { value: 40, color: 'd' },
    ]);
    expect(lookup.get('b')).toMatchObject({ min: 5, max: 35 });
  });

  it('keeps clipped endpoints open, using the actual palette length', () => {
    const lookup = makeRasterValueRangeLookup(palette, [true, true]);
    expect(lookup.get('a')).toMatchObject({ max: 5, lowerUnbounded: true });
    expect(lookup.get('c')).toMatchObject({ min: 15, upperUnbounded: true });
    expect(lookup.get('b')).toMatchObject({ lowerUnbounded: false, upperUnbounded: false });
  });

  it('does not invent a value for unknown colors or an empty palette', () => {
    expect(makeRasterValueRangeLookup(palette).get('unknown')).toBeUndefined();
    expect(makeRasterValueRangeLookup([]).size).toBe(0);
  });

  it.each([
    { min: 1.19137, max: 1.21106 },
    { min: -0.0367, max: -0.0242 },
    { min: 123_456.789, max: 131_327.981 },
    { min: 0, max: 0.0019685 },
  ])('rounds outwards without narrowing %j', (range) => {
    const rounded = roundValueRange(range);
    expect(rounded.min).toBeLessThanOrEqual(range.min);
    expect(rounded.max).toBeGreaterThanOrEqual(range.max);
    expect(rounded.max).toBeGreaterThan(rounded.min);
  });

  it('does not expand exact decimal boundaries because of floating point noise', () => {
    expect(roundValueRange({ min: 1.2, max: 1.3 })).toMatchObject({ min: 1.2, max: 1.3 });
  });
});
