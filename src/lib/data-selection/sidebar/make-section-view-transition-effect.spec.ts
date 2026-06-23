import { describe, expect, it } from 'vitest';

import {
  applySectionViewTransition,
  type PathSidebarState,
  type SectionViewTransitionConfig,
} from './make-section-view-transition-effect';

type TestView = 'hazard' | 'exposure';

const TOP_LEVEL = ['hazards', 'exposure', 'vulnerability', 'risk', 'adaptation'] as const;

const CONFIG = {
  hazard: {
    enter: { showPaths: ['hazards'], hideOtherTopLevel: true },
    exit: { hidePaths: ['hazards'] },
  },
  exposure: {
    enter: { showPaths: ['exposure'], hideOtherTopLevel: true },
    exit: { hidePaths: ['exposure'] },
  },
} satisfies SectionViewTransitionConfig<TestView>;

function collectPathUpdates(
  newView: TestView,
  previousView: TestView | undefined,
): Map<string, PathSidebarState> {
  const updates = new Map<string, PathSidebarState>();

  applySectionViewTransition(
    CONFIG,
    TOP_LEVEL,
    (path, state) => {
      updates.set(path, state);
    },
    newView,
    previousView,
  );

  return updates;
}

describe('applySectionViewTransition', () => {
  it('shows enter paths and hides other top-level sections on first run', () => {
    expect(collectPathUpdates('exposure', undefined)).toEqual(
      new Map([
        ['exposure', { expanded: true, visible: true }],
        ['hazards', { expanded: false, visible: false }],
        ['vulnerability', { expanded: false, visible: false }],
        ['risk', { expanded: false, visible: false }],
        ['adaptation', { expanded: false, visible: false }],
      ]),
    );
  });

  it('runs exit then enter and hides other top-level sections on view change', () => {
    expect(collectPathUpdates('exposure', 'hazard')).toEqual(
      new Map([
        ['hazards', { expanded: false, visible: false }],
        ['exposure', { expanded: true, visible: true }],
        ['vulnerability', { expanded: false, visible: false }],
        ['risk', { expanded: false, visible: false }],
        ['adaptation', { expanded: false, visible: false }],
      ]),
    );
  });

  it('does nothing when the view is unchanged', () => {
    expect(collectPathUpdates('hazard', 'hazard')).toEqual(new Map());
  });
});
