import { useAssertImmutable } from './use-assert-immutable';

/**
 * Returns one of two hooks based on condition. This is useful mostly for reducing code duplication,
 * where we need to switch between two hooks that otherwise have the exact same interface.
 *
 * For example, when we either want to call some callback in useEffect or in useLayoutEffect
 *
 * NOTE: the value of the condition must be immutable - it cannot change during the lifetime of the hook,
 * as that would effectively violate rules of hooks (React relies on hooks types and order not changing over time).
 * A changing condition will lead to an error.
 */
export function useConditionalHook<HookT>(
  condition: boolean,
  trueHook: HookT,
  falseHook: HookT,
): HookT {
  // assert that the condition value never changes from the value on the first render
  useAssertImmutable(condition);
  return condition ? trueHook : falseHook;
}
