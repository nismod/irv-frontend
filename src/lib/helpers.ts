import _ from 'lodash';

import { makeColor } from './colors';
import { ValueLabel } from './controls/params/value-label';

/**
 * Common helper functions
 *
 */

export function commas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function titleCase(str: string) {
  if (str == null) return `${str}`;
  const splitStr = str.toLowerCase().split(' ');
  for (let k = 0; k < splitStr.length; k++) {
    splitStr[k] = splitStr[k].charAt(0).toUpperCase() + splitStr[k].substring(1);
  }
  return splitStr.join(' ');
}

export function numFormat(n: number, maximumSignificantDigits: number = 3) {
  return n == null ? `-` : n.toLocaleString(undefined, { maximumSignificantDigits });
}

export function numFormatMoney(value: number) {
  return value.toLocaleString(undefined, {
    maximumSignificantDigits: 3,
    maximumFractionDigits: 2,
  });
}

export function numRangeFormat(n1: number, n2: number) {
  if (n1 == null || n2 == null) return null;

  return `${numFormat(n1)}–${numFormat(n2)}`;
}

/**
 * Wrap value in parentheses, if value is not empty
 * @param x value to wrap
 * @returns string with parentheses or empty string
 */
export function paren(x: any) {
  return x == null ? '' : `(${x})`;
}

export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function toDictionary<T, K extends string, V>(
  array: T[],
  keyFn: (x: T) => K,
  valueFn: (x: T) => V,
): Record<K, V> {
  return Object.fromEntries(array.map((x) => [keyFn(x), valueFn(x)])) as Record<K, V>;
}

export function makeConfig<C, K extends string>(cfg: (C & { id: K })[]) {
  return toDictionary(
    cfg,
    (x) => x.id,
    (x) => x,
  );
}

type ValueMissingError<T extends string, E extends T> = `${Exclude<T, E>} is missing`;

/**
 * Make a function that checks if a given array contains all elements of the specified union type.
 *
 * Useful when defining an ordering of a certain set of values.
 * If the original set has an added value later on, the old ordering won't compile until the new value is added.
 * **CAUTION**: this cannot prevent duplicated values in the array.
 *
 * Example usage:
 * ```
 * type AType = 'foo' | 'bar';
 * const aTypeOrdering = makeOrderingCheck<AType>();
 *
 * const x = aTypeOrdering(['foo']) // <- error!
 * const y = aTypeOrdering(['foo', 'bar', 'baz']) // <- error!
 * const z = aTypeOrdering(['foo', 'bar']) // <- OK
 * const w = aTypeOrdering(['foo', 'foo', 'bar']) // Caution, also OK
 * ```
 * @returns
 */
export const makeOrderingCheck = <T extends string>() => {
  return <E extends T[]>(
    array: E & ([T] extends [E[number]] ? unknown : ValueMissingError<T, E[number]>),
  ) => array;
};

export function makeColorConfig<K extends string>(cfg: Record<K, string>) {
  return _.mapValues(cfg, makeColor);
}

// see discussion at https://stackoverflow.com/questions/23437476/in-typescript-how-to-check-if-a-string-is-numeric
export function isNumeric(val: any): boolean {
  return !(val instanceof Array) && val - parseFloat(val) + 1 >= 0;
}

export function truthyKeys<K extends string = string>(obj: Record<K, any>) {
  return Object.keys(obj).filter((k) => obj[k]) as K[];
}

export function fromKeys<K extends string, T>(keys: K[], values: T): Record<K, T> {
  return _.fromPairs(keys.map((key) => [key, values])) as Record<K, T>;
}

/**
 * Returns sum of array elements, or null if all elements are null
 */
export function sumOrNone(arr: number[]): number | null {
  let result: number = null;

  for (const x of arr) {
    if (x != null) {
      if (result == null) result = x;
      else result += x;
    }
  }
  return result;
}

/**
 * Generic type for a function validating that the argument is a object with
 * Used to enforce value types in a config object, but not obscuring the key names
 * by using a TS lookup type
 */
type ValueTypeCheck<C> = <K extends string>(x: Record<K, C>) => Record<K, C>;

/**
 * Creates a function that enforces all fields of its argument to be of type C
 * Useful to create configs where each field must be of a set type,
 * but the list of keys should be accessible to users of the config variable.
 */
export function valueType<C>(): ValueTypeCheck<C> {
  return (x) => x;
}

/**
 * Checks for nullish values, with TS type guard
 * Mostly useful in a formatting function when you want to return the unchanged value
 * if it's nullish, but you want the returned value to not modify the automatically inferred
 * return type of the function. E.g. when formatting numbers to strings, just returning
 * the value if it's nullish would result in a number | string return type.
 * This is needed because a normal x == null check doesn't narrow the type of x to null.
 * @param v value to check
 * @returns is the value null or undefined
 */
export function isNullish(v: any): v is null | undefined {
  return v == null;
}

export function toLabelLookup<T extends string>(valueLabels: ValueLabel<T>[]) {
  return toDictionary(
    valueLabels,
    (x) => x.value,
    (x) => x.label,
  );
}

/**
 * Ensure that a supplied string union is a subset of another union
 */
export type Subset<Original extends string, SubUnion extends Original> = SubUnion;

export function makeOptions<T extends string>(
  values: T[],
  labelFn: (x: T) => string = (x: T) => x,
) {
  return values.map((val) => ({
    value: val,
    label: labelFn(val),
  }));
}

/**
 * From https://stackoverflow.com/a/43053803/1478817
 * Compute a "cartesian product" of multiple arrays
 * (all combinations of values from all arrays).
 * @param a
 * @returns
 */
export function cartesian(...a: any[][]) {
  return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
}

export function eventPreventDefault(e) {
  e.preventDefault();
}

export function eventStopPropagation(e) {
  e.stopPropagation();
}

export type Unrequired<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Equivalent of array.includes(val) but with type guard and automatic const type treatment of array
 */
export const inlist = <T, const ElemT extends T>(val: T, arr: ReadonlyArray<ElemT>): val is ElemT =>
  arr.includes(val as ElemT);

export function firstNonEmptyString(...args: (string | null | undefined)[]): string {
  return args.find((x) => x != null && x !== '') ?? '';
}
