import { DependencyList, startTransition, useEffect, useRef, useState } from 'react';

const areDependenciesEqual = (prev: DependencyList, next: DependencyList) => {
  if (prev.length !== next.length) {
    return false;
  }

  return prev.every((value, index) => Object.is(value, next[index]));
};

/**
 * Standard useMemo that accepts an additional trigger that is not a dependency of the callback,
 * and which, when updated, will cause a recalculation.
 * This is mostly to avoid having to manually silence rules-of-hooks warnings about unnecessary deps,
 * when the trigger is not used in the callback
 * @param callback function to call to return the memoed result
 * @param dependencies dependencies of the callback
 * @param trigger trigger which will cause recalculation. It shouldn't be a dependency of the callback
 * @returns memoed result of the callback
 */
export function useTriggerMemo<T>(
  callback: () => T,
  dependencies: DependencyList,
  trigger: unknown,
) {
  const [memoValue, setMemoValue] = useState(() => callback());
  const dependenciesRef = useRef<DependencyList>(dependencies);
  const triggerRef = useRef(trigger);

  useEffect(() => {
    const depsChanged = !areDependenciesEqual(dependenciesRef.current, dependencies);
    const triggerChanged = !Object.is(triggerRef.current, trigger);

    if (!depsChanged && !triggerChanged) {
      return;
    }

    dependenciesRef.current = dependencies;
    triggerRef.current = trigger;

    const nextValue = callback();
    startTransition(() => {
      setMemoValue(nextValue);
    });
  }, [callback, dependencies, trigger]);

  return memoValue;
}
