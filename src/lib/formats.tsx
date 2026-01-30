import { ReactNode } from 'react';

export type FormatFunction<T = any> = (x: T) => ReactNode | string;

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
  return (value: number) => formatFn(value.toLocaleString(undefined, numberFormatOptions));
}

/**
 * Wraps a format function in a null/undefined check and returns
 * a replacement string ('-' by default) if the value is null
 */
export function nullFormat<T>(
  formatFn: FormatFunction<T>,
  nullReplacement: string = '-',
): FormatFunction<T> {
  return (x: any) => (x != null ? formatFn(x) : nullReplacement);
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
