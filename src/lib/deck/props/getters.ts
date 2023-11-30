import { DataLoader } from '@/lib/data-loader/data-loader';

/**
 * A deck.gl-compatible data accessor function, extended with two *optional* properties:
 * - `updateTriggers` - can store the updateTriggers that the accessor function depends on. This is useful to store the dependencies of the accessor next to the function itself. Layer definition is responsible for actually passing these values eventually to deck.gl's `updateTriggers`
 * - `dataLoader` - can store the external data loader used by the accessor. This is useful to determine which data loaders are actually in use, by iterating over all data accessors and extracting the data loaders from them.
 */
export type AccessorFunction<Out, In = any> = ((x: In) => Out) & {
  updateTriggers?: any[];
  dataLoader?: DataLoader;
};

/** A deck.gl-compatible attribute getter - either a value, or an accessor function to generate a value */
export type Accessor<Out, In = any> = Out | AccessorFunction<Out, In>;

/** Utility function to merge `updateTrigger` properties from multiple accessor functions.
 *
 * @returns a new array with the merged `updateTrigger` arrays. If none of the accessors have `updateTriggers`, an empty array is returned
 */
export function mergeTriggers(...accessors: AccessorFunction<any>[]) {
  const res = [];
  for (const acc of accessors) {
    for (const elem of acc.updateTriggers ?? []) {
      res.push(elem);
    }
  }
  return res;
}

/** Utility function to set the `updateTriggers` on the accessor function. Returns the first argument with the property added. */
export function withTriggers(fn: AccessorFunction<any>, triggers: any[]) {
  fn.updateTriggers = triggers;
  return fn;
}

/** Utility function to set the `updateTriggers` on the accessor function, based on an external data loader.
 * Returns the first argument with the property added.
 *
 * **NOTE**: this will override any old `updateTriggers` on the accessor, if present
 */
export function withLoaderTriggers(fn: AccessorFunction<any>, dataLoader: DataLoader) {
  fn.dataLoader = dataLoader;
  return withTriggers(fn, [dataLoader.id, dataLoader.updateTrigger]);
}

/**
 * Get update triggers for an accessor (value or accessor function).
 * If the accessor has an `updateTriggers` property, it is returned.
 * If it doesn't but it is a function, an empty array is returned.
 * Otherwise, `undefined` is returned.
 */
export function getTriggers<OutT, InT>(accessor: Accessor<OutT, InT>) {
  return (accessor as any)?.updateTriggers ?? (typeof accessor === 'function' ? [] : undefined);
}
