import { RESET } from 'jotai/utils';

/**
 * Check whether a value is Jotai's `RESET` sentinel.
 *
 * This mirrors the previous `isReset` helper for Recoil's `DefaultValue`.
 *
 * In Jotai, atom set-handlers can receive `RESET` to indicate "fall back to the default".
 * Unlike Recoil's `DefaultValue` (which is a class), `RESET` is a unique symbol exported
 * from `jotai/utils`. We expose `RESET` again so consumers do not need to import it
 * separately, and provide `isReset` for symmetry with the existing codebase.
 */
export const isReset = (candidate: unknown): candidate is typeof RESET => candidate === RESET;

export { RESET };
