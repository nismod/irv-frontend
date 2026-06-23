import { useStore } from 'jotai';
import type { SetStateAction, WritableAtom } from 'jotai/vanilla';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

/** Atoms whose write accepts a route param value (includes primitive atoms). */
type RouteParamAtom<T extends string | undefined> = WritableAtom<T, [SetStateAction<T>], void>;

/**
 * Sync a single route param (from `react-router-dom`'s `useParams`) into a Jotai atom.
 *
 * Writes synchronously during render so child components and Jotai effects see the route
 * value before they mount. One-way only: navigate to change the param, not `set(atom)`.
 */
export function useRouteParamSync<T extends string | undefined>(
  paramName: string,
  atom: RouteParamAtom<T>,
) {
  const params = useParams();
  const value = params[paramName] as T;
  const store = useStore();

  if (!Object.is(store.get(atom), value)) {
    store.set(atom, value);
  }
}

/**
 * Wraps children and keeps `atom` in sync with a route param before rendering them.
 *
 * Place inside a `<Route>` whose path includes the named segment.
 */
export function RouteParamSync<T extends string | undefined>({
  atom,
  paramName,
  children,
}: {
  atom: RouteParamAtom<T>;
  paramName: string;
  children?: ReactNode;
}) {
  useRouteParamSync(paramName, atom);
  return children;
}
