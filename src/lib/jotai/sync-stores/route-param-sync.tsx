import type { WritableAtom } from 'jotai';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Sync a single route param (from `react-router-dom`'s `useParams`) into a Jotai atom.
 *
 * Replacement for the `MapViewRouteSync` Recoil-sync provider that previously bridged the
 * `:view` route segment into `viewState`. Unlike that provider, this helper is a tiny
 * mount-only component plus a hook — there is no `RecoilSync` wrapper involved.
 *
 * Caveats
 * -------
 * - The atom is only written to from the route; **changing the atom does NOT push back
 *   into the URL/route**. This matches the legacy behaviour of `MapViewRouteSync` whose
 *   `RecoilSync` config defined `read` and `listen` but not `write`.
 * - The atom must be writable with a value of the same type as the (string) route param.
 *   For optional segments, the route value can be `undefined`, so the atom should accept it.
 */
export function useRouteParamSync<T extends string | undefined>(
  paramName: string,
  atom: WritableAtom<unknown, [T], unknown>,
) {
  const params = useParams();
  const value = params[paramName] as T;
  const setAtom = useSetAtom(atom);

  useEffect(() => {
    setAtom(value);
  }, [setAtom, value]);
}

/**
 * Mount-only component variant of `useRouteParamSync`.
 *
 * Drop-in replacement for `<MapViewRouteSync>`: place it inside a `<Route>` whose path
 * includes the named segment, and the named atom will follow that segment.
 */
export function RouteParamSync<T extends string | undefined>({
  paramName,
  atom,
}: {
  paramName: string;
  atom: WritableAtom<unknown, [T], unknown>;
}) {
  useRouteParamSync(paramName, atom);
  return null;
}
