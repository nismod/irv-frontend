import type { WritableAtom } from 'jotai';
import difference from 'lodash/difference';

import type { StateEffectWithPrevious } from '@/lib/jotai/effects/atom-effect-with-previous';

export type PathSidebarState = { expanded: boolean; visible: boolean };

export type SectionViewTransitionConfig<V extends string> = Record<
  V,
  {
    enter: { showPaths: readonly string[]; hideOtherTopLevel: boolean };
    exit: { hidePaths: readonly string[] };
  }
>;

type BooleanAtomFamily = (path: string) => WritableAtom<boolean, [boolean], void>;

function setPaths(
  setPath: (path: string, state: PathSidebarState) => void,
  paths: readonly string[],
  state: PathSidebarState,
) {
  for (const path of paths) {
    setPath(path, state);
  }
}

export function applySectionViewTransition<V extends string>(
  config: SectionViewTransitionConfig<V>,
  topLevelSections: readonly string[],
  setPath: (path: string, state: PathSidebarState) => void,
  newView: V,
  previousView: V | undefined,
) {
  if (newView === previousView) return;

  const { showPaths, hideOtherTopLevel } = config[newView].enter;

  setPaths(setPath, showPaths, { expanded: true, visible: true });

  if (hideOtherTopLevel) {
    setPaths(setPath, difference([...topLevelSections], [...showPaths]), {
      expanded: false,
      visible: false,
    });
  }

  if (previousView != null) {
    setPaths(setPath, config[previousView].exit.hidePaths, { expanded: false, visible: false });
  }
}

export function makeSectionViewTransitionEffect<V extends string>(
  config: SectionViewTransitionConfig<V>,
  topLevelSections: readonly string[],
  expandedAtomFamily: BooleanAtomFamily,
  visibilityAtomFamily: BooleanAtomFamily,
): StateEffectWithPrevious<V> {
  return ({ set }, newView, previousView) => {
    applySectionViewTransition(
      config,
      topLevelSections,
      (path, state) => {
        set(expandedAtomFamily(path), state.expanded);
        set(visibilityAtomFamily(path), state.visible);
      },
      newView,
      previousView,
    );
  };
}
