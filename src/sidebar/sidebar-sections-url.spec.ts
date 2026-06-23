import { describe, expect, it } from 'vitest';

import {
  constructSectionsUrlTree,
  hydratePreferencesFromUrlTree,
  isSectionsTree,
  pathToVisibility,
  type SectionsTree,
} from './sidebar-sections-url';

describe('pathToVisibility', () => {
  it.each<[SectionsTree | boolean | null | undefined, string, boolean]>([
    [{ hazards: {} }, 'hazards', true],
    [{ hazards: {} }, 'hazards/fluvial', false],
    [{ hazards: { fluvial: true } }, 'hazards/fluvial', true],
    [{ hazards: { fluvial: false } }, 'hazards/fluvial', false],
    [{ hazards: true }, 'hazards', true],
    [{ hazards: true }, 'hazards/fluvial', false],
    [null, 'hazards', false],
    [{}, 'hazards', false],
  ])('pathToVisibility(%j, %s) → %s', (tree, path, expected) => {
    expect(pathToVisibility(tree, path)).toBe(expected);
  });

  it('returns true for empty path', () => {
    expect(pathToVisibility(null, '')).toBe(true);
  });
});

describe('isSectionsTree', () => {
  it.each<[unknown, boolean]>([
    [{ hazards: true }, true],
    [{ hazards: { fluvial: true } }, true],
    [{ hazards: {} }, true],
    [null, false],
    [[], false],
    [{ hazards: 'yes' }, false],
    [42, false],
  ])('isSectionsTree(%j) → %s', (value, expected) => {
    expect(isSectionsTree(value)).toBe(expected);
  });
});

describe('constructSectionsUrlTree', () => {
  const childIds: Record<string, string[]> = {
    '': ['hazards', 'exposure'],
    hazards: ['fluvial', 'coastal'],
    'hazards/fluvial': ['aqueduct', 'jrc'],
  };

  it.each<[Record<string, boolean>, SectionsTree]>([
    [
      { hazards: true, 'hazards/fluvial': true, 'hazards/fluvial/aqueduct': true },
      {
        hazards: { fluvial: { aqueduct: true } },
      },
    ],
    [{ hazards: true }, { hazards: {} }],
    [{ exposure: true }, { exposure: true }],
    [{}, {}],
  ])('projects visible preferences %j → %j', (visibleByPath, expected) => {
    const result = constructSectionsUrlTree(
      '',
      (path) => visibleByPath[path] ?? false,
      (path) => childIds[path] ?? [],
    );

    expect(result).toEqual(expected);
  });

  it('omits hidden top-level sections while siblings stay visible', () => {
    const result = constructSectionsUrlTree(
      '',
      (path) => path === 'exposure',
      (path) => childIds[path] ?? [],
    );

    expect(result).toEqual({ exposure: true });
  });
});

describe('hydratePreferencesFromUrlTree', () => {
  it.each<[SectionsTree, Record<string, boolean>]>([
    [{ hazards: { fluvial: true } }, { hazards: true, 'hazards/fluvial': true }],
    [
      { hazards: { fluvial: { aqueduct: true } } },
      { hazards: true, 'hazards/fluvial': true, 'hazards/fluvial/aqueduct': true },
    ],
    [{ exposure: false }, { exposure: false }],
  ])('hydrates preferences from %j', (tree, expected) => {
    const prefs: Record<string, boolean> = {};

    hydratePreferencesFromUrlTree(tree, '', (path, visible) => {
      prefs[path] = visible;
    });

    expect(prefs).toEqual(expected);
  });
});
