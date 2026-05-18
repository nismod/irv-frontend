/**
 * Regex that matches an ISO-8601 date string.
 *
 * Reused from the previous `RecoilLocalStorageSync` implementation so the on-disk
 * payloads (`local-storage`) remain interchangeable between the Recoil and Jotai
 * runtimes during the migration.
 *
 * Source: https://stackoverflow.com/a/3143231
 */
export const ISO_DATE_REGEX =
  // eslint-disable-next-line no-useless-escape
  /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

/**
 * `JSON.parse` reviver that converts ISO-8601 date strings back into Date instances.
 *
 * This preserves the date-revival behavior of the previous `RecoilLocalStorageSync`
 * helper. Jotai's `createJSONStorage` takes a `reviver` option, so we plug this in
 * directly when building the storage.
 */
export function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string' && ISO_DATE_REGEX.test(value)) {
    return new Date(value);
  }
  return value;
}
