# 02 — Recoil → Jotai mapping

Audience: someone implementing the migration. Difficulty levels are subjective but tracked consistently:

- **low** — straightforward rename; behavior matches.
- **medium** — concept shifts (e.g. parameter equality, Suspense semantics, reset sentinel); needs care but no rearchitecture.
- **high** — significant rewrite of the surrounding pattern; needs design.

Companion: [`01-recoil-inventory.md`](./01-recoil-inventory.md) for the call-site lists.

This document assumes **Jotai v2** semantics (the current API as of 2026): atoms are plain factories, families come from `jotai/utils`, an explicit store can be obtained via `useStore` / `createStore`, and `RESET` (symbol) replaces `DefaultValue`.

---

## §2.1 Recoil API → Jotai mapping

### `atom`

- **Used:** 43 sites (mostly leaf settings).
- **Jotai:** `import { atom } from 'jotai'`.
- **Difficulty:** low.
- **Notes:** Recoil requires unique string `key`; Jotai uses object identity. You can keep a string `debugLabel` for devtools (`myAtom.debugLabel = 'mapZoom'`). The keys we register also flow through `recoil-sync` `itemKey`s — those will need to be re-anchored when migrating sync (see below).

Sketch:

```ts
// Recoil
export const showLabelsState = atom({ key: 'showLabels', default: false });

// Jotai
export const showLabelsAtom = atom(false);
showLabelsAtom.debugLabel = 'showLabels';
```

### `selector` (sync)

- **Used:** 62 sites.
- **Jotai:** read-only `atom((get) => …)`.
- **Difficulty:** low for sync ones with no fan-out.

```ts
// Recoil
export const hazardVisibilityState = selector({
  key: 'hazardVisibilityState',
  get: ({ get }) =>
    Object.fromEntries(HAZARDS_MAP_ORDER.map((g) => [g, get(hazardSelectionState(g))])),
});

// Jotai
export const hazardVisibilityAtom = atom((get) =>
  Object.fromEntries(HAZARDS_MAP_ORDER.map((g) => [g, get(hazardSelectionAtom(g))])),
);
```

### `selector` with async `get` (returns a Promise)

- **Used at:** `apiFeatureQuery` ([`src/state/queries.ts`](../../../src/state/queries.ts)), `rasterAllSourcesQuery`/`rasterSourceDomainsQuery` ([`src/state/data-domains/sources.ts`](../../../src/state/data-domains/sources.ts)), `colorMapValuesQuery` ([`src/config/terracotta-color-map.ts`](../../../src/config/terracotta-color-map.ts)).
- **Jotai:** `atom(async (get) => …)`.
- **Difficulty:** medium. **Three behavior shifts to watch for:**
  1. **Suspense default:** in Jotai v2, `useAtomValue(asyncAtom)` suspends by default (good — matches Recoil). To consume _without_ suspending, wrap with `loadable(asyncAtom)` from `jotai/utils`.
  2. **Refetch / refresh:** Recoil's `useRecoilRefresher_UNSTABLE` does not exist in Jotai — to refetch, you re-set the atom via a writable wrapper or restart by re-mounting / using a deps key in the atom. We don't use the refresher today, so this is informational only.
  3. **Family parameter identity:** see `selectorFamily` below — async selector families have the same param-equality caveat.

```ts
// Recoil
const colorMapValuesQuery = selectorFamily({
  key: 'colorMapValuesQuery',
  get: (colorScheme: string) => async () =>
    apiClient.colormap.colormapGetColormap({ colormap: colorScheme, stretchRange: '[0,1]' }),
});

// Jotai
const colorMapValuesAtom = atomFamily((colorScheme: string) =>
  atom(async () =>
    apiClient.colormap.colormapGetColormap({ colormap: colorScheme, stretchRange: '[0,1]' }),
  ),
);
```

### `selector` with `set` (writable)

- **Used at:** `allowedGroupLayersState` ([`src/lib/data-map/interactions/interaction-state.ts`](../../../src/lib/data-map/interactions/interaction-state.ts)), `mapViewStateState` ([`src/state/map-view/map-view-state.ts`](../../../src/state/map-view/map-view-state.ts)), `sidebarPathVisibilityState` (built by `makeHierarchicalVisibilityState`), and the `makeSelectState` factory output.
- **Jotai:** `atom(getter, setter)`.
- **Difficulty:** medium because the `RESET` sentinel needs reconsideration (see next item).

```ts
// Jotai equivalent
import { RESET } from 'jotai/utils';

// Recoil pattern
selector({
  key: '...',
  get: ({ get }) => combine(get(a), get(b)),
  set: ({ set, reset }, newVal) => {
    if (newVal instanceof DefaultValue) {
      reset(a);
      reset(b);
    } else {
      set(a, newVal.a);
      set(b, newVal.b);
    }
  },
});

const compound = atom(
  (get) => combine(get(a), get(b)),
  (get, set, newVal: Combined | typeof RESET) => {
    if (newVal === RESET) {
      set(a, RESET);
      set(b, RESET);
    } else {
      set(a, newVal.a);
      set(b, newVal.b);
    }
  },
);
```

### `atomFamily` / `selectorFamily`

- **Used:** 12 atomFamilies, 13 selectorFamilies.
- **Jotai:** `atomFamily(factory, areEqual?)` from `jotai/utils`.
- **Difficulty:** medium.
- **Critical caveat:** Jotai's `atomFamily` keys by `===` (reference identity) by default. Recoil internally stable-stringifies the param. **The two families that take object params will silently mis-cache without a custom `areEqual`:**
  - `paramValueState` and `paramOptionsState` — param `{ group: string; param: string }`.
  - `terracottaColorMapValuesQuery` — param `{ scheme: string; range: [number, number] }`.
  - `lastSubmittedJobByParamsState` — param `{ boundaryName, processorVersion }`.

Use `fast-deep-equal` (already widely available) or a small custom equality:

```ts
import equal from 'fast-deep-equal';
import { atomFamily } from 'jotai/utils';

export const paramValueAtoms = atomFamily(
  ({ group, param }: { group: string; param: string }) =>
    atom((get) => get(paramsAtoms(group))?.[param]?.value),
  equal,
);
```

**Lifecycle nuance:** `atomFamily` from `jotai/utils` retains entries forever by default. Call `family.remove(param)` when you know an entry won't be needed again — usually not relevant for this app, but worth knowing for the per-tab `mobileTabHasContentState` and per-path sidebar families.

### `waitForAll`

- **Used at:** [`src/state/layers/view-layers.ts`](../../../src/state/layers/view-layers.ts) (single site).
- **Jotai:** `atom((get) => deps.map(get))` for sync deps, or `atom(async (get) => Promise.all(deps.map(get)))` if any are async.
- **Difficulty:** low. All current deps are sync (each `*LayerState` is a sync selector).

```ts
// Recoil
get(waitForAll([landCoverLayerState, populationLayerState, ...]))

// Jotai
const viewLayersAtom = atom((get) =>
  flattenConfig([
    get(landCoverLayerAtom),
    get(populationLayerAtom),
    /* ... */
  ]),
);
```

### `noWait`

- **Used at:** `hazardDataParamsState` in [`src/details/features/damages/DamagesSection.tsx`](../../../src/details/features/damages/DamagesSection.tsx).
- **Jotai:** `loadable(asyncAtom)` from `jotai/utils`.
- **Difficulty:** medium. Output shape differs: Recoil returns `{ state: 'hasValue' | 'loading' | 'hasError', contents }`; Jotai `loadable` returns `{ state: 'hasData' | 'loading' | 'hasError', data | error }`. The call site needs both the new shape and the new state name (`'hasData'`, not `'hasValue'`).

```ts
// Recoil
const c = get(noWait(paramsConfigState(hazard)));
return c.state === 'hasValue' ? c.contents : undefined;

// Jotai
const loadableAtom = loadable(paramsConfigAtoms(hazard));
const c = get(loadableAtom);
return c.state === 'hasData' ? c.data : undefined;
```

### `DefaultValue` and `useResetRecoilState`

- **Used:** `DefaultValue` for `instanceof` checks (4 files); `useResetRecoilState` (2 sites: `DeselectButton.tsx`, `MapView.tsx`).
- **Jotai:** `RESET` symbol + `useResetAtom(atom)` from `jotai/utils`. `isReset(x)` in [`src/lib/recoil/is-reset.ts`](../../../src/lib/recoil/is-reset.ts) becomes `x === RESET`.
- **Difficulty:** low. The change is mechanical, but every writable selector's `set` branch that checks `instanceof DefaultValue` needs to switch to a `=== RESET` check, **and** the type signature of `newVal` must include `| typeof RESET`.
- **One caveat:** Jotai's `useResetAtom` works only on atoms created with `atomWithReset` or atoms whose write handler explicitly handles `RESET`. For derived writable atoms (like `allowedGroupLayersState` or `mapViewStateState`), include the `RESET` branch in the setter and `useResetAtom` will work.

### `useRecoilState`, `useRecoilValue`, `useSetRecoilState`

- **Used:** 38 + 52 + 16 sites.
- **Jotai:** `useAtom`, `useAtomValue`, `useSetAtom` (all from `jotai`).
- **Difficulty:** low. Mostly find-and-replace, but verify async atoms render the same Suspense boundary.

### `useResetRecoilState`

- **Used:** `DeselectButton.tsx` resets `selectionState(group)`; `MapView.tsx` resets `mapFitBoundsState`.
- **Jotai:** `useResetAtom` (see above).
- **Difficulty:** low — but ensure each family member supports reset. For `selectionState` family (`atomFamily(... default: null)`) the default is straightforward; `useResetAtom(selectionAtoms(group))` works only if the family atoms are made with `atomWithReset(null)` or if you set `null` explicitly via `useSetAtom`.

### `useRecoilValueLoadable`

- **Used at:** [`src/state/data-params.ts`](../../../src/state/data-params.ts) (in `useLoadParamsConfig`).
- **Jotai:** `useAtomValue(loadable(asyncAtom))`.
- **Difficulty:** medium — the state name shift (`'hasValue'` → `'hasData'`) is the only catch.

### `useRecoilCallback`

- **Used:** 5 sites.
  - [`src/lib/recoil/use-set-recoil-state-family.ts`](../../../src/lib/recoil/use-set-recoil-state-family.ts) (uses `{ set }`).
  - [`src/lib/recoil/state-effects/use-state-effect.ts`](../../../src/lib/recoil/state-effects/use-state-effect.ts) (uses the whole `CallbackInterface`, including `transact_UNSTABLE` and the snapshot).
  - [`src/lib/data-selection/sidebar/SubSectionToggle.tsx`](../../../src/lib/data-selection/sidebar/SubSectionToggle.tsx) (uses `{ snapshot }` and `snapshot.getLoadable(...)`).
  - [`src/lib/paths/EnforceSingleChild.tsx`](../../../src/lib/paths/EnforceSingleChild.tsx) (uses `{ set }`).
- **Jotai:** `useAtomCallback` from `jotai/utils` gives `(get, set) => …`. There is **no `snapshot` equivalent** — read current values via `get` inside the callback.
- **Difficulty:** medium where `snapshot.getLoadable` is used (one site), low elsewhere.

```ts
// Recoil
const cb = useRecoilCallback(({ snapshot }) => async (path) => {
  const loadable = snapshot.getLoadable(visibilityToggleState(path));
  if (loadable.state === 'hasValue') {
    /* use loadable.getValue() */
  }
});

// Jotai
const cb = useAtomCallback(
  useCallback((get, set, path: string) => {
    // for async atoms, wrap in loadable() first
    const value = get(visibilityToggleAtom(path));
    // for sync atoms, just use it.
  }, []),
);
```

### `useRecoilTransaction_UNSTABLE`

- **Used:** 6 sites.
  - [`src/state/data-params.ts`](../../../src/state/data-params.ts) — `useUpdateDataParam`.
  - [`src/sidebar/sections/risk/infrastructure-risk.tsx`](../../../src/sidebar/sections/risk/infrastructure-risk.tsx) — two transactions (`updateExposureTx`, `hideExposureTx`).
  - [`src/sidebar/sections/risk/population-exposure.tsx`](../../../src/sidebar/sections/risk/population-exposure.tsx) — same pattern.
  - [`src/modules/downloads/data/jobs.ts`](../../../src/modules/downloads/data/jobs.ts) — `useMoveJobToCompleted`.
- **Jotai:** **no direct equivalent**. The transaction guarantee — multiple atom writes apply as one snapshot — is approximated by Jotai's batching of sequential `store.set` calls in one synchronous tick, plus React 18's auto-batching of state updates. For our specific call sites, none rely on cross-atom _reads_ needing to see a half-written state, so we can replace each transaction with a sequence of `store.set` calls (via `useStore` + `useCallback` or `useAtomCallback`):

```ts
// Recoil
const tx = useRecoilTransaction_UNSTABLE(
  ({ get, set }) =>
    (jobId) => {
      const list = get(submittedJobsState);
      // ... compute new lists
      set(submittedJobsState /* ... */);
      set(completedJobsState /* ... */);
    },
  [],
);

// Jotai
const moveJobToCompleted = useAtomCallback(
  useCallback((get, set, jobId: string) => {
    const list = get(submittedJobsAtom);
    // ... compute new lists
    set(submittedJobsAtom /* ... */);
    set(completedJobsAtom /* ... */);
  }, []),
);
```

- **Difficulty:** medium. Watch for:
  - `useUpdateDataParam` reads and writes the same atom family — fine in Jotai because `get` inside the callback returns the latest committed value, and the second `set` overwrites the first.
  - `syncExposure` / `hideExposure` in [`src/sidebar/sections/risk/population-exposure.tsx`](../../../src/sidebar/sections/risk/population-exposure.tsx) explicitly comment that they write the _leaf_ atomFamily (not the hierarchical selector) because Recoil disallows setting selectors inside `transact_UNSTABLE`. In Jotai, you can also write the selector since there is no transactional restriction — but the simpler / more correct path is to keep writing the leaf, matching today's behavior.

### `RecoilRoot`

- **Used at:** [`src/App.tsx`](../../../src/App.tsx) (main) and [`src/pages/articles/components/ArticleMap.tsx`](../../../src/pages/articles/components/ArticleMap.tsx) (nested per-embed).
- **Jotai:** **no `Provider` required at root** — without a `Provider`, all atoms share an implicit global store. For _isolation_ (the article-map case), wrap the subtree in `<Provider store={createStore()}>` (from `jotai`).
- **Difficulty:** low for the main app (remove `RecoilRoot`); low for `ArticleMap` (`<Provider>` with a fresh store per instance).

```tsx
// ArticleMap migration
import { createStore, Provider } from 'jotai';

export const ArticleMap: FC<ArticleMapProps> = (props) => {
  const store = useMemo(() => createStore(), []);
  return <Provider store={store}>{/* ... */}</Provider>;
};
```

### `recoil-sync` — `RecoilSync`, `syncEffect`, `urlSyncEffect`, `RecoilURLSyncJSON`

This is the highest-risk surface. `recoil-sync` provides:

1. **A pluggable read/write/listen protocol** so multiple atoms can opt in via a single `<RecoilSync storeKey="...">` provider. Diffs are tracked per commit.
2. **`syncEffect`** — adds the sync behavior to an atom by passing a `refine` validator.
3. **`urlSyncEffect`** — same but specifically for `RecoilURLSync*` providers, with `itemKey` mapped to a query-string key and a custom `write` callback that produces a string.
4. **`RecoilURLSyncJSON`** — built-in JSON encoder for query strings.

#### Jotai equivalents

| Use case                              | Today                                                                                                                                                                                                       | Proposed Jotai replacement                                                                                                                                                                                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Single atom persisted in localStorage | `syncEffect({ storeKey: 'local-storage', refine, syncDefault: true })` on `submittedJobsState`, `completedJobsState`                                                                                        | `atomWithStorage` from `jotai/utils` with a custom `Storage` adapter that preserves date revival (`JSON.parse` reviver matching `dateRegex`) and validates via `@recoiljs/refine` or `zod`. Cross-tab `storage` event listening is built-in.                                              |
| Atom synced to URL query string       | `urlSyncEffect({ storeKey: 'url-json', itemKey: 'z', refine: number(), write: ... })` on `mapZoomUrlState`, `mapLatUrlState`, `mapLonUrlState`, `pixelDrillerSiteUrlState`, `sidebarSectionsUrlParamsState` | `atomWithLocation` / `atomWithHash` from `jotai-location` (community) **or** a custom `atomWithUrlSync` built on `URLSearchParams` + `window.history.replaceState`. Each URL atom needs its own (de)serialiser and an integration with react-router so URL writes don't fight the router. |
| Per-family atom URL sync              | `effects: (path) => [defaultSectionVisibilitySyncEffect(path)]` on `sidebarVisibilityToggleState`                                                                                                           | Either (a) collapse into a single URL atom `sectionsAtom` plus a derived family that reads/writes that atom (closer to today's `sidebarSectionsUrlParamsState`), or (b) lift the URL-sync side-effect into one custom `useEffect` mounted alongside the `RecoilRoot` replacement.         |
| Route-param-to-atom sync              | `<RecoilSync storeKey="map-view-route" read listen>` in `MapViewRouteSync.tsx` + `syncEffect({ storeKey: 'map-view-route' })` on `viewState`                                                                | A single small component that reads `useParams()['view']` and `useSetAtom(viewAtom)` in a `useEffect`. No need for the full `RecoilSync` indirection.                                                                                                                                     |

**Difficulty:** high overall, mostly because there are 5 distinct sync sites with subtly different semantics (round-trip stringification for numeric URL params, absence-means-default for `pixelDrillerSiteUrlState`, hierarchical write composition for `sectionsAtom`, etc.). Plan to design a single, repo-local `jotai-sync/` module that mirrors today's `lib/recoil/sync-stores/` and `lib/recoil/state-sync/` surfaces before migrating any consumers. See `04-migration-slices.md` §4.1 step 3 for sequencing.

### `@recoiljs/refine`

- **Used:** 5 files for input validation in sync effects.
- `@recoiljs/refine` is a standalone validator library (it does not depend on Recoil). **Nothing forces us to replace it** when migrating away from Recoil. Options:
  - **Keep it** (lowest cost) — works fine inside any custom Jotai sync layer.
  - **Replace with `zod` or `valibot`** — independent decision driven by ergonomics, not the migration.
- **Difficulty if replacing:** medium per file, but mechanical.

---

## §2.2 Helper-by-helper migration of `src/lib/recoil/`

Grouped by replacement strategy.

### Group A — trivial rename / shape preservation (low risk)

#### `lib/recoil/types.ts`

| Recoil type                                      | Jotai equivalent                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `RecoilStateFamily<DataType, ParamType>`         | `(param: ParamType) => WritableAtom<DataType, [DataType], void>` (or use a re-exportable alias). |
| `RecoilReadableStateFamily<DataType, ParamType>` | `(param: ParamType) => Atom<DataType>`                                                           |
| `ReadSelectorGetDefinition<T>`                   | `Read<T>` where `type Read<T> = (get: Getter) => T \| Promise<T>`                                |

**Action:** create [`src/lib/jotai/types.ts`](../../../src/lib/jotai/types.ts) with these aliases; update each call site to import from the new module.

#### `lib/recoil/StateWatcher.tsx`

Direct port:

```tsx
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

export function StateWatcher<T>({
  state,
  onValue,
}: {
  state: Atom<T>;
  onValue: (value: T) => void;
}) {
  const value = useAtomValue(state);
  useEffect(() => {
    onValue(value);
  }, [onValue, value]);
  return null;
}
```

No behavior change.

#### `lib/recoil/use-set-recoil-state-family.ts`

```ts
import { useStore } from 'jotai';
import { useCallback } from 'react';

export function useSetAtomFamily<S, P>(atomFamily: (param: P) => WritableAtom<S, [S], void>) {
  const store = useStore();
  return useCallback(
    (param: P, value: S) => store.set(atomFamily(param), value),
    [store, atomFamily],
  );
}
```

Note we drop `useRecoilCallback` because Jotai exposes the store directly via `useStore()`.

#### `lib/recoil/make-state/make-select-state.ts`

`makeSelectState` becomes a tiny factory that creates two atoms (primitive + derived):

```ts
import { atom, Atom } from 'jotai';

export function makeSelectAtom<T>(
  optionsAtom: Atom<T[]>,
  defaultFn: (options: T[]) => T = (xs) => xs?.[0],
): WritableAtom<T, [T | null], void> {
  const internalAtom = atom<T | null>(null);
  return atom(
    (get) => {
      const selected = get(internalAtom);
      const options = get(optionsAtom);
      return selected == null || !options.includes(selected) ? defaultFn(options) : selected;
    },
    (_get, set, value) => set(internalAtom, value),
  );
}
```

No `key` arg needed. Behavior identical.

#### `lib/recoil/state-sync/use-sync-state.ts`

Trivially renames:

```ts
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export function useSyncValueToAtom<T>(value: T, replicaAtom: PrimitiveAtom<T>, doSync = true) {
  const setReplica = useSetAtom(replicaAtom);
  useEffect(() => {
    if (doSync) setReplica(value);
  }, [doSync, setReplica, value]);
}

export function useSyncAtomToAtom<T>(
  source: Atom<T>,
  replicaAtom: PrimitiveAtom<T>,
  doSync = true,
) {
  const value = useAtomValue(source);
  useSyncValueToAtom(value, replicaAtom, doSync);
}
```

#### `lib/recoil/state-sync/use-sync-state-throttled.ts` and `StateSyncRoot.tsx`

Same shape — mechanical port.

### Group B — concept reshape (medium risk)

#### `lib/recoil/is-reset.ts`

Replace with:

```ts
import { RESET } from 'jotai/utils';

export const isReset = (candidate: unknown): candidate is typeof RESET => candidate === RESET;
```

Then update [`src/lib/data-map/interactions/interaction-state.ts`](../../../src/lib/data-map/interactions/interaction-state.ts) so the writable atom's setter accepts `RESET` and the existing `isReset` check still works.

#### `lib/recoil/state-effects/types.ts`

Recoil's `TransactionInterface_UNSTABLE` does not exist in Jotai. Refactor the types to:

```ts
import { Atom, Getter, Setter, WritableAtom } from 'jotai';

export type StateEffectInterface = { get: Getter; set: Setter };

export type StateEffect<T> = (ops: StateEffectInterface, value: T, previousValue: T) => void;
export type CurrentStateEffect<T> = (ops: StateEffectInterface, value: T) => void;

// "Async" was Recoil-flavoured (snapshot + set + reset). In Jotai there is no snapshot;
// merge it with the sync variant or remove the async distinction altogether.
```

#### `lib/recoil/state-effects/use-state-effect.ts` + `StateEffectRoot.tsx`

Replace the `useRecoilCallback` + `transact_UNSTABLE` machinery with `useAtomCallback`. Drop the atomic/async distinction since Jotai has neither transactions nor snapshots:

```ts
import { useAtomValue, useStore } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback, useEffect } from 'react';

import { usePrevious } from '@/lib/hooks/use-previous';

export function useStateEffect<T>(state: Atom<T>, effect: StateEffect<T>) {
  const value = useAtomValue(state);
  const previousValue = usePrevious(value);

  const run = useAtomCallback(
    useCallback(
      (get, set) => effect({ get, set }, value, previousValue),
      [effect, value, previousValue],
    ),
  );

  useEffect(() => {
    run();
  }, [run]);
}
```

**Caveats**

- Today's `StateEffectRoot` (atomic) and `StateEffectRootAsync` callers can be unified onto a single component, since there is no transaction distinction. Verify the call sites can drop "previous value" reads through `snapshot`:
  - [`src/sidebar/SidebarContent.tsx`](../../../src/sidebar/SidebarContent.tsx) `viewTransitionEffect` uses only `set` and reads `previousView` from the second arg — already compatible.
  - [`src/sidebar/sections/risk/infrastructure-risk.tsx`](../../../src/sidebar/sections/risk/infrastructure-risk.tsx) `syncHazardEffect` / `syncInfrastructureWithSectorEffect` use `iface.set` + `iface.get` paths — also compatible.

### Group C — significant rewrite (high risk)

#### `lib/recoil/sync-stores/RecoilLocalStorageSync.tsx`

Replace the `RecoilSync` provider + storage adapter with a Jotai-style `Storage` implementation usable from `atomWithStorage`. Two design options:

**Option C1 — per-atom `atomWithStorage`** (simplest, recommended).

```ts
// lib/jotai/sync/local-storage.ts
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const dateReviver = (key: string, value: any) =>
  typeof value === 'string' && dateRegex.test(value) ? new Date(value) : value;

const localStorageWithDates = createJSONStorage(() => window.localStorage, {
  reviver: dateReviver,
});
// (jotai's createJSONStorage doesn't take a reviver out of the box —
//  wrap localStorage in a small adapter that uses JSON.parse(text, dateReviver))

export function atomWithLocalStorage<T>(key: string, initial: T) {
  return atomWithStorage<T>(key, initial, localStorageWithDates);
}
```

Then [`src/modules/downloads/data/jobs.ts`](../../../src/modules/downloads/data/jobs.ts) becomes:

```ts
export const submittedJobsAtom = atomWithLocalStorage<SavedJob[]>('submittedJobs', []);
```

Cross-tab `storage` event listening is built into `atomWithStorage`. Validation (today via `@recoiljs/refine`) can be applied inside a derived read atom, or by validating in the storage adapter's `getItem`.

**Option C2 — preserve the centralised provider** by building a Jotai `Store` wrapper that subscribes/manages many keys. More complex; only worth it if we discover the need for atomic multi-atom writes to storage. Today we don't have that, so prefer C1.

#### `RecoilURLSyncJSON` (queryParams) in `App.tsx`

Two parts:

1. **URL number atoms** (`map-url.ts`) — define `atomWithUrlSync({ key: 'z', refine: number(), serialize, parse })` per atom. Implement `atomWithUrlSync` on top of `atomWithLocation` from `jotai-location`, or a small custom hook that calls `history.replaceState` and listens to `popstate`. Make sure the `write` debouncing matches today's per-frame coalescing (today's URL writes go through `useSyncStateThrottled` at 2000 ms).
2. **Structured `sectionsAtom`** ([`src/sidebar/url-state.tsx`](../../../src/sidebar/url-state.tsx)) — keep the same shape (`Record<string, true | object>`); the read/write functions in `constructObject` / `pathToVisibility` remain useful and can be reused as the (de)serialiser for the URL value. Replace `urlSyncEffect` with an effect-like atom or a top-level `useEffect` that uses the new URL-sync infrastructure.

#### `MapViewRouteSync.tsx`

Replace the `RecoilSync` + `syncEffect({ storeKey: 'map-view-route' })` indirection with a single React component:

```tsx
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { viewAtom } from '@/state/view';

export function MapViewRouteSync({ children }) {
  const { view } = useParams();
  const setView = useSetAtom(viewAtom);
  useEffect(() => {
    if (view) setView(view as ViewType);
  }, [view, setView]);
  return children;
}
```

`viewAtom` ([`src/state/view.ts`](../../../src/state/view.ts)) reverts to a plain `atom<ViewType>('hazard')` with no sync effect — the component is the sync.

---

## §2.3 Side-by-side cheat-sheet (printable)

| Recoil                                     | Jotai                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `atom({ key, default })`                   | `atom(default)` (or `atomWithReset`/`atomWithStorage` for variants)         |
| `selector({ key, get })`                   | `atom((get) => …)`                                                          |
| `selector({ key, get, set })`              | `atom((get) => …, (get, set, val) => …)`                                    |
| async `selector`                           | `atom(async (get) => …)`                                                    |
| `atomFamily({ key, default })`             | `atomFamily(p => atom(default))` (+ custom `areEqual` for object params)    |
| `selectorFamily({ key, get })`             | `atomFamily(p => atom((get) => …))`                                         |
| `waitForAll`                               | `atom((get) => [get(a), get(b)])`                                           |
| `noWait`                                   | `loadable(asyncAtom)`                                                       |
| `DefaultValue` / `useResetRecoilState`     | `RESET` / `useResetAtom`                                                    |
| `useRecoilState`/`Value`/`SetRecoilState`  | `useAtom`/`useAtomValue`/`useSetAtom`                                       |
| `useRecoilCallback({ snapshot, set })`     | `useAtomCallback((get, set) => …)`                                          |
| `useRecoilTransaction_UNSTABLE`            | sequential `set` calls in a `useAtomCallback` (relies on React 18 batching) |
| `useRecoilValueLoadable`                   | `useAtomValue(loadable(atom))`                                              |
| `RecoilRoot`                               | (none at root) / `<Provider store={createStore()}>` for isolation           |
| `RecoilSync` + `syncEffect` (localStorage) | `atomWithStorage`                                                           |
| `RecoilURLSync*` + `urlSyncEffect`         | custom URL-sync layer (or `jotai-location`)                                 |
| `@recoiljs/refine`                         | keep as-is, or replace with `zod` / `valibot`                               |
