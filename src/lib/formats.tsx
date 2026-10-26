import { ReactNode } from 'react';

import { roundValueRange, type ValueRange } from './value-range';

export type FormatFunction<T = any> = {
  (x: T): ReactNode | string;
  formatRange?: (range: ValueRange) => ReactNode | string;
};

export function numFormatWhole(nearest: number): FormatFunction<number> {
  nearest = nearest ? nearest : 1;
  return Object.assign(
    (value: number) =>
      `${(Math.round(value / nearest) * nearest).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    { formatRange: makeValueFormat('_').formatRange },
  );
}

/**
 * Helper function to format numerical values in legends, tooltips etc.
 * TODO: make usage of this function and numFormat etc consistent
 * @param format simple format string where _ will be replaced by the formatted number
 * @param numberFormatOptions options to pass to Number.toLocaleString()
 * @returns function that accepts a number and returns a formatted string
 */
export function makeValueFormat(
  format: string | ((children: string) => ReactNode),
  numberFormatOptions?: Intl.NumberFormatOptions,
): FormatFunction<number> {
  const formatFn =
    typeof format === 'string' ? (x) => <>{format.replace('_', x)}</> : (x) => format(x);
  const formatter: FormatFunction<number> = (value) =>
    formatFn(value.toLocaleString(undefined, numberFormatOptions));

  formatter.formatRange = (range) => {
    if (range.min === range.max && !range.lowerUnbounded && !range.upperUnbounded) {
      return formatter(range.min);
    }
    const { min, max, fractionDigits } = roundValueRange(range);
    const options = { ...numberFormatOptions };
    // A range needs enough digits to distinguish its endpoints, even when the
    // single-value formatter rounds more coarsely. Percentages scale by 100.
    delete options.maximumSignificantDigits;
    delete options.minimumSignificantDigits;
    options.maximumFractionDigits = Math.max(
      0,
      fractionDigits - (options.style === 'percent' ? 2 : 0),
    );
    options.minimumFractionDigits = Math.min(
      options.minimumFractionDigits ?? 0,
      options.maximumFractionDigits,
    );
    const lower = min.toLocaleString(undefined, options);
    const upper = max.toLocaleString(undefined, options);
    const text = range.lowerUnbounded
      ? `≤${upper}`
      : range.upperUnbounded
        ? `≥${lower}`
        : min === max
          ? lower
          : `${lower}–${upper}`;
    return formatFn(text);
  };

  return formatter;
}

/**
 * Wraps a format function in a null/undefined check and returns
 * a replacement string ('-' by default) if the value is null
 */
export function nullFormat<T>(
  formatFn: FormatFunction<T>,
  nullReplacement: string = '-',
): FormatFunction<T> {
  const formatter: FormatFunction<T> = (x) => (x != null ? formatFn(x) : nullReplacement);
  formatter.formatRange = formatFn.formatRange;
  return formatter;
}

/**
 * Formats a number to three significant figures and adds SI suffix
 * - only if larger than 1000.
 */
export function roundWithSuffix(x: number): string {
  const precision = 3;
  if (x < 1e3) {
    return x + '';
  }
  const order = (Math.log10(x) / 3) | 0;
  let val = x / 10 ** (order * 3);
  if (val >= 1e3) {
    val = x / 10 ** ((order + 1) * 3);
  }
  const str = val.toPrecision(precision);
  const suffixes = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  const suffix = suffixes[order];
  return str + suffix;
}
