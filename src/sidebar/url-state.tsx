import { bool, dict, lazy, union } from '@recoiljs/refine';
import { Suspense, useContext } from 'react';
import { atom, GetRecoilValue, selector, useRecoilValue } from 'recoil';
import { syncEffect, urlSyncEffect } from 'recoil-sync';

import { getSubPath } from '@/lib/paths/paths';
import { PathChildrenStateContext } from '@/lib/paths/sub-path';
import { StateSyncRoot } from '@/lib/recoil/state-sync/StateSyncRoot';

import { sidebarPathChildrenState, sidebarVisibilityToggleState } from './SidebarContent';

function constructObject(get: GetRecoilValue, path: string) {
  const visible = path === '' || get(sidebarVisibilityToggleState(path));
  if (!visible) return null;

  const children = get(sidebarPathChildrenState(path));

  if (children == null) return null;

  if (children.length === 0) return true;

  return Object.fromEntries(
    children
      .map((c) => [c, constructObject(get, getSubPath(path, c))])
      .filter(([path, val]) => val != null),
  );
}

const sidebarSectionsUrlOutwardState = selector({
  key: 'sidebarSectionsUrlOutward',
  get: ({ get }) => constructObject(get, ''),
});

const sectionsChecker = dict(
  union(
    bool(),
    lazy(() => sectionsChecker),
  ),
);

/**
 * The main sidebar sections atom synced to the URL
 */
export const sidebarSectionsUrlParamsState = atom({
  key: 'sidebarSectionsUrlParams',
  default: {},
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'sections',
      refine: sectionsChecker,
      history: 'replace',
      syncDefault: true,
    }),
  ],
});

/**
 * Sync effect to get initial state of single sidebar section visibility
 */
export function defaultSectionVisibilitySyncEffect(path: string) {
  return syncEffect({
    storeKey: 'url-json',
    refine: bool(),
    read: ({ read }) => (path === '' ? true : pathToVisibility(read('sections'), path)),
    write: () => {},
  });
}

function splitFirst(str: string, sep: string) {
  const idx = str.indexOf(sep);
  if (idx === -1) {
    return [str, undefined];
  }
  return [str.substring(0, idx), str.substring(idx + 1)];
}

function pathToVisibility(obj: any, path: string) {
  if (obj == null) return false;

  const [next, restPath] = splitFirst(path, '/');
  const nextObject = obj[next];

  if (restPath == null) {
    return nextObject == null ? false : typeof nextObject === 'boolean' ? nextObject : true;
  } else {
    return pathToVisibility(nextObject, restPath);
  }
}

export function SidebarUrlStateSyncRoot() {
  const childrenLoadingState = useContext(PathChildrenStateContext).childrenLoadingState;
  const childrenLoading = useRecoilValue(childrenLoadingState(''));

  return (
    <Suspense fallback={null}>
      <StateSyncRoot
        state={sidebarSectionsUrlOutwardState}
        replicaState={sidebarSectionsUrlParamsState}
        doSync={!childrenLoading}
      />
    </Suspense>
  );
}
