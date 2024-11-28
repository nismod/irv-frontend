type MergeStrategy<T = any> = (oldValue: T, newValue: T) => T;

/**
 * A function to merge multiple props-like objects.
 * This is inspired by Deck.GL layer props-merging behavior, but is extended
 * with the ability to specify custom merging strategies for entries specified by key
 * @param mergeStrategies the merge strategies for specified fields. If not strategy is defined for a field, that field will be overwritten by later values
 * @returns a function that accepts variadic object arguments and returns a merged object
 */
export function makeObjectsMerger(
  mergeStrategies: Record<string, MergeStrategy>,
  defaultMergeStrategy?: MergeStrategy,
) {
  return (...objects: (object | undefined)[]) => {
    const mergedProps: Record<string, any> = {};

    for (const props of objects) {
      for (const [key, value] of Object.entries(props ?? {})) {
        const strategy = mergeStrategies[key] ?? defaultMergeStrategy;
        mergedProps[key] = strategy ? strategy(mergedProps[key], value) : value;
      }
    }
    return mergedProps;
  };
}

/** Merge two object values with Object.assign() semantics. Handle undefined arguments */
export const mergeValue = (oldVal, newVal) => Object.assign({}, oldVal ?? {}, newVal);

/** Merge two array values by concatenating them. Handle undefined arguments */
export const appendValue = <T>(oldVal: T[], newVal: T[]) => [...(oldVal ?? []), ...(newVal ?? [])];

/** Merge two function values by creating a new function that calls all the merged functions and returns their results combined into an array. Handle undefined arguments. */
export const composeAppendValue =
  (oldVal: Function, newVal: Function) =>
  (...args) => [oldVal?.(...args), newVal?.(...args)];
