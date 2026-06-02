import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { atomWithDefault } from 'jotai/utils';

import { makeHierarchicalVisibilityAtomFamily } from '@/lib/data-selection/make-hierarchical-visibility-state';
import { atomWithUrlSync, URL_PARAM_ABSENT } from '@/lib/jotai/sync-stores/atom-with-url-sync';

import {
  constructSectionsUrlTree,
  isSectionsTree,
  type SectionsTree,
} from './sidebar-sections-url';

/** Per-path sidebar visibility preference. Survives parent hide (e.g. view transitions). */
export const sidebarVisibilityToggleAtomFamily = atomFamily((_path: string) => atom(false));

/** Outward projection of visible preferences — drives the `sections` URL param. */
export const sidebarSectionsUrlOutwardAtom = atom((get) => {
  const tree = constructSectionsUrlTree(
    '',
    (path) => get(sidebarVisibilityToggleAtomFamily(path)),
    (path) => get(sidebarPathChildrenAtomFamily(path)),
  );
  return tree == null || typeof tree === 'boolean' ? {} : tree;
});

/** URL replica for `?sections=...` (written from outward projection, read once to hydrate preferences). */
export const sidebarSectionsUrlAtom = atomWithUrlSync<SectionsTree>('sections', {
  defaultValue: {},
  syncDefault: true,
  deserialize: (raw) => {
    try {
      const parsed: unknown = JSON.parse(raw);
      return isSectionsTree(parsed) ? parsed : URL_PARAM_ABSENT;
    } catch {
      return URL_PARAM_ABSENT;
    }
  },
});

/** Accordion expanded state; defaults to visibility but can be overridden locally. */
export const sidebarExpandedAtomFamily = atomFamily((path: string) =>
  atomWithDefault((get) => get(sidebarVisibilityToggleAtomFamily(path))),
);

export const sidebarPathChildrenAtomFamily = atomFamily((_path: string) => atom<string[]>([]));

export const sidebarPathChildrenLoadingAtomFamily = atomFamily((_path: string) => atom(true));

/** Hierarchical visibility: parent path must also be visible. */
export const sidebarPathVisibilityAtomFamily = makeHierarchicalVisibilityAtomFamily(
  sidebarVisibilityToggleAtomFamily,
);
