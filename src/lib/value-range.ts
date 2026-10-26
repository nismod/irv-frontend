export interface ValueRange {
  min: number;
  max: number;
  lowerUnbounded?: boolean;
  upperUnbounded?: boolean;
}

/** Round outwards at the scale of the uncertainty, never narrowing the interval. */
export function roundValueRange(range: ValueRange) {
  const width = range.max - range.min;
  const exponent = width > 0 ? Math.floor(Math.log10(width)) - 1 : 0;
  const step = 10 ** exponent;
  const round = (value: number, direction: (value: number) => number) =>
    Number((direction(Number((value / step).toPrecision(14))) * step).toPrecision(14));

  return {
    ...range,
    min: width > 0 ? round(range.min, Math.floor) : range.min,
    max: width > 0 ? round(range.max, Math.ceil) : range.max,
    fractionDigits: Math.min(20, Math.max(0, -exponent)),
  };
}
