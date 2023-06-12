import { useState } from 'react';

/**
 * Asserts that the supplied value doesn't change during the lifetime of the hook.
 * Useful when some hook arguments are flags for reducing code repetition, but shouldn't change
 * after the first time the hook is called, because changing it would cause the violationg of rules of hooks
 */
export function useAssertImmutable<T>(value: T) {
  const [firstValue] = useState(value);

  if (firstValue !== value) {
    throw new Error(`Hook value must be immutable. Initial: ${firstValue}, current: ${value}`);
  }
}
