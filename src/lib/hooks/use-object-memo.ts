import { useMemo } from 'react';

/**
 * Creates an object of the same structure as the input object.
 * However, the resulting object is only re-created if any of the fields changes
 * based on comparison with shallow (reference) equality.
 *
 * This is useful when we want to create a sub-object from fields of another object,
 * but want to use the sub-object as input to React hooks like useMemo, and therefore
 * we would like for it not to change if the fields don't change.
 *
 * Example:
 * ```ts
 * function Component() {
 *  // the result of useQuery has many more properties
 *  const { status, data } = useQuery();
 *  const queryDetails = useObjectMemo({ status, data });
 *
 *  const processed = useMemo(() => processQueryObj(queryDetails), [queryDetails]);
 *
 *  // use `processed` processed in rendering
 *
 * }
 * ```
 */
export function useObjectMemo<T extends object>(obj: T): T {
  // sort field names alphabetically to avoid triggering useMemo due to object property iteration order
  const fieldNames = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  const fieldValues = fieldNames.map((n) => obj[n]);

  return useMemo(
    () => Object.fromEntries(fieldNames.map((n) => [n, obj[n]])) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fieldValues,
  );
}
