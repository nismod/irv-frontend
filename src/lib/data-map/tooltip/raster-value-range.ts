import type { ColorValue } from '@/lib/data-map/legend/GradientLegend';
import type { ValueRange } from '@/lib/value-range';

/** Terracotta rounds to the nearest palette index, so bin edges are midpoints. */
export function makeRasterValueRangeLookup(
  colorValues: ColorValue[],
  [minTruncated, maxTruncated]: [boolean, boolean] = [false, false],
): Map<string, ValueRange> {
  const lookup = new Map<string, ValueRange>();

  colorValues.forEach(({ color, value }, i) => {
    if (!Number.isFinite(value)) return;
    const previous = colorValues[i - 1]?.value ?? value;
    const next = colorValues[i + 1]?.value ?? value;
    const range: ValueRange = {
      min: (previous + value) / 2,
      max: (value + next) / 2,
      lowerUnbounded: i === 0 && minTruncated,
      upperUnbounded: i === colorValues.length - 1 && maxTruncated,
    };
    const existing = lookup.get(color);
    // Quantized palettes can repeat an RGB color. Include every matching bin
    // instead of arbitrarily choosing the last occurrence of that color.
    lookup.set(
      color,
      existing
        ? {
            min: Math.min(existing.min, range.min),
            max: Math.max(existing.max, range.max),
            lowerUnbounded: existing.lowerUnbounded || range.lowerUnbounded,
            upperUnbounded: existing.upperUnbounded || range.upperUnbounded,
          }
        : range,
    );
  });

  return lookup;
}
