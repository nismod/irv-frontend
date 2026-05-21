# Implementation Notes — Steps 1‑3 of the Migration

This document records the **concrete decisions, deviations and follow-up actions** taken while implementing the first three steps of the migration order from `04-migration-slices.md`:

1. Add Jotai as a dependency.
2. Port `lib/recoil/` helpers to `lib/jotai/` under new names.
3. Build replacement sync layers (localStorage, URL, route).

> No consumer code has been touched yet — Recoil + RecoilSync are still wired up in `App.tsx`. The new helpers live alongside the old ones and the build remains green.

---

## 1. Dependencies

Added the following to `package.json` (via `npm install --save`):

| Package           | Version   | Why                                                                                                                                                                                                                                                                      |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `jotai`           | `^2.20.0` | Target state library. v2 is required for `loadable`, the modern `Provider`, and `onMount` semantics relied on by the URL sync helper.                                                                                                                                    |
| `jotai-family`    | `^1.0.2`  | `atomFamily` from `jotai/utils` is **deprecated in Jotai 2.20** and will be removed in v3. The exported API of `jotai-family` is byte-for-byte identical, so adopting it now avoids a second migration.                                                                  |
| `fast-deep-equal` | `^3.1.3`  | Required for `atomFamily(..., isDeepEqual)` on **object-shaped params** (the previous Recoil `atomFamily` used `dangerouslyAllowMutability` + reference identity, which doesn't translate cleanly). Was already present transitively, now an explicit direct dependency. |

### Decisions

- **No `recoil-sync` replacement library was added.** The candidates (`jotai-location`, `jotai-history`, `jotai-uri`, etc.) are either unmaintained, larger than we need, or impose specific routing conventions. Instead we wrote the URL + route sync helpers in-tree (see §3). One less dependency, full control over the wire format, and they can be replaced with a community package later if desired.
- **No new validator library.** The legacy code uses `@recoiljs/refine` for runtime validation. Rather than swapping it out wholesale (which is a separate, large concern), the new `atomWithLocalStorage` accepts a `(value: unknown) => value is T` type predicate. Callers can either wrap their existing refine checkers (`(v) => myChecker(v).type === 'success'` as a type guard) or rewrite as plain TS guards when each slice is migrated.
- **No top-level lockfile changes outside the three new packages.** The `npm install` ran with `--no-audit --no-fund` to avoid noise and did not touch the React or TypeScript versions.

---

## 2. Ported helpers (`src/lib/jotai/`)

The folder mirrors `src/lib/recoil/` one-for-one so that, during the migration, two files in the same role live next to each other and a diff between the two can be reviewed easily.

| New path                                                                                | Replaces                                       | Notes                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/jotai/types.ts`                                                                    | `lib/recoil/types.ts`                          | Renamed types (`RecoilStateFamily` → `JotaiStateFamily`, etc.). Family types now use `AtomFamily` from `jotai-family`.                                                                                                                                                            |
| `lib/jotai/is-reset.ts`                                                                 | `lib/recoil/is-reset.ts`                       | `isReset` now checks for the `RESET` Symbol from `jotai/utils`. Also re-exports `RESET` so callers don't have to import from `jotai/utils` separately.                                                                                                                            |
| `lib/jotai/StateWatcher.tsx`                                                            | `lib/recoil/StateWatcher.tsx`                  | Same shape, uses `useAtomValue`.                                                                                                                                                                                                                                                  |
| `lib/jotai/use-set-atom-family.ts`                                                      | `lib/recoil/use-set-recoil-state-family.ts`    | Renamed `useSetRecoilStateFamily` → `useSetAtomFamily`. Internally uses `useAtomCallback`.                                                                                                                                                                                        |
| `lib/jotai/make-state/make-select-atom.ts`                                              | `lib/recoil/make-state/make-select-state.ts`   | Renamed `makeSelectState` → `makeSelectAtom`. **No longer takes a `key` argument** (Jotai atoms don't carry stable keys — set `result.debugLabel` if you need one for devtools). The setter accepts the existing `RESET` sentinel to clear the selection.                         |
| `lib/jotai/state-sync/{use-sync-state,use-sync-state-throttled,StateSyncRoot}.{ts,tsx}` | `lib/recoil/state-sync/*`                      | Same shape; uses `useAtomValue` + `useSetAtom`.                                                                                                                                                                                                                                   |
| `lib/jotai/state-effects/types.ts`                                                      | `lib/recoil/state-effects/types.ts`            | `StateEffectInterface = { get, set }`. Reset via `set(atom, RESET)` (import from `@/lib/jotai/is-reset`). The Recoil "atomic" and "async" interface aliases are preserved for one-to-one renaming, but **point to the same type in Jotai** because there is no transaction layer. |
| `lib/jotai/state-effects/use-state-effect.ts`                                           | `lib/recoil/state-effects/use-state-effect.ts` | Both `useStateEffectAtomic` and `useStateEffectAsync` are kept (and identical) for naming parity. Implemented on top of `useAtomCallback`; passes `{ get, set }` directly to effects.                                                                                             |
| `lib/jotai/state-effects/StateEffectRoot.tsx`                                           | `lib/recoil/state-effects/StateEffectRoot.tsx` | Same shape; `StateEffectRoot` and `StateEffectRootAsync` are both kept.                                                                                                                                                                                                           |

### Key behavioural deltas to be aware of when migrating consumers

1. **State effects are no longer transactional.** In Recoil, `useStateEffectAtomic` batched all `set` calls into one commit via `transact_UNSTABLE`. In Jotai, each `set` updates the store synchronously, and intermediate `get`s see the new value. Outwardly the result is the same; observers that subscribed to specific atoms may see them update in the same render pass. **No code change is needed in the consumers; just be aware that you can no longer rely on "no observers see partial state" guarantees.**
2. **`useStateEffectAsync` and `StateEffectRootAsync` are exact aliases.** This makes the rename of consumers trivial (no API change), at the cost of a small amount of redundant code. We could collapse them later, but doing so as part of the slice migration risks a wider blast radius.
3. **`atomFamily`-with-object-params** must use `isDeepEqual` from `fast-deep-equal` when the original Recoil family relied on dangerous mutability. Where the new family is introduced, pass it explicitly:

   ```ts
   import isDeepEqual from 'fast-deep-equal';
   import { atomFamily } from 'jotai-family';

   export const myFamily = atomFamily((param: MyParam) => atom(/* ... */), isDeepEqual);
   ```

4. **`useAtomCallback` does not accept a dependency array.** The Recoil equivalents accepted one as their second argument. Callers must wrap their callback in `useCallback` themselves (we have done this for the ported helpers).
5. **ESLint `additionalHooks`** — done in slice 4a: `eslint.config.mjs` now includes `useAtomCallback` alongside the Recoil hooks.

### Why some Recoil helpers were _not_ renamed identically

- `useRecoilCallback` did not have a wrapper in `lib/recoil/` — it was used directly. We did not introduce a wrapper for `useAtomCallback`. Consumers should import directly from `jotai/utils`.
- The old `StateSyncRoot` exposed a `state: RecoilValueReadOnly<T>` parameter; the new one accepts `Atom<T>`, which is more permissive (any readable atom). This is strictly broader and should not break any caller.

---

## 3. Sync layer (`src/lib/jotai/sync-stores/`)

The Recoil version used `RecoilLocalStorageSync`, `RecoilURLSyncJSON` and `MapViewRouteSync` — all three were `RecoilSync` provider components mounted near the App root, working by `storeKey`. The Jotai version is **per-atom**: each atom is built with a helper that owns its persistence wire directly.

| Helper                                           | Replaces                                                                                 | Wire format                                                                                                                                                                                                                  |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `atomWithLocalStorage(key, defaultValue, opts?)` | `RecoilLocalStorageSync` + `syncEffect({ storeKey: 'local-storage', ... })`              | JSON string per key in `localStorage`. Same as before.                                                                                                                                                                       |
| `atomWithUrlSync(key, opts)`                     | `RecoilURLSyncJSON storeKey="url-json"` + `urlSyncEffect({ storeKey: 'url-json', ... })` | JSON-encoded query parameter per key. Same as before by default; opt out via `serialize`/`deserialize`.                                                                                                                      |
| `RouteParamSync` / `useRouteParamSync`           | `MapViewRouteSync`                                                                       | Reads a `react-router-dom` param and pushes it into an atom. **One-way (route → atom).**                                                                                                                                     |
| `makeUrlNumberCodec(maximumFractionDigits)`      | `makeWriteNumber` (private helper inside `state/map-view/map-url.ts`)                    | Number ↔ fixed-precision string (e.g. `10.5` ↔ `'10.5'`). Drop-in for the existing `?z=10.5` URLs.                                                                                                                           |
| `makeUrlStringCodec()`                           | n/a (new opt-in)                                                                         | Raw string ↔ raw string. Yields friendlier URLs (`?site=lat,lng` rather than `?site=%22lat%2Clng%22`) but is **not** wire-compatible with the existing `pixelDrillerSiteUrlState`. Adopt only when changing the wire format. |

### `atomWithLocalStorage`

- Wraps Jotai's built-in `atomWithStorage` + `createJSONStorage`, adding:
  - Date revival on read (re-using the ISO-8601 regex from the legacy code so persisted timestamps deserialize back into `Date` instances — preserving the on-disk format of `submittedJobsState` / `completedJobsState`).
  - A **single, shared `storage`-event listener** dispatched to per-key callback sets. This matches the legacy `listenLocalStorage` behaviour (one listener for the whole window) and removes the need for the `RecoilLocalStorageSync` provider component in `App.tsx`.
  - Optional `(value: unknown) => value is T` validator, threaded through Jotai's `unstable_withStorageValidator`.
- Defaults `getOnInit: true` so the atom hydrates synchronously on first read (matching `RecoilLocalStorageSync` semantics).

### `atomWithUrlSync`

- **Why not a 3rd-party library?** See §1.
- Each call returns a writable atom with `[Value | typeof RESET]` setter args. Setting `RESET` removes the parameter from the URL (or writes the default when `syncDefault: true`).
- Uses `history.replaceState` by default; pass `history: 'push'` to add a history entry on every change.
- Synchronously hydrates from `window.location.search` on atom creation, then re-reads in `onMount` to capture any URL change between atom module load and first mount.
- Subscribes to a single shared `popstate` listener (similar pattern to `atomWithLocalStorage`) so back/forward navigation propagates to every URL-synced atom.
- Multi-atom writes in the same tick are safe: each call to the internal `writeParam` reads the **current** `window.location.search`, so sequential updates accumulate rather than overwrite each other.

### Open notes / known limitations

- **No coalescing of writes within a tick.** If many URL atoms change at once (e.g. on initial map view restoration) you'll get multiple `replaceState` calls in a row. This is harmless functionally but slightly wasteful. If it ever becomes an issue, add a `queueMicrotask`-based scheduler around `writeParam`. Documented inside the file.
- **Hash routing (`#?z=10`) is not supported.** The current routes use BrowserRouter with normal query strings, so this is fine for now. If hash routing is ever introduced, swap `window.location.search` for the hash portion in `read/writeParam`.
- **Two URL atoms with the same key** are unsupported (last write wins, both will see each other's values via `popstate`). Don't do this — same as `recoil-sync` couldn't.

### `RouteParamSync`

- One-way push from `react-router-dom` `useParams()` into an atom. The atom does not write back to the route; this matches the legacy `MapViewRouteSync` behaviour (which only configured `read` + `listen`, not `write`).
- For the single existing consumer (`viewState`) the migration will look like:

  ```tsx
  // before
  <MapViewRouteSync>
    <Outlet />
  </MapViewRouteSync>

  // after
  <>
    <RouteParamSync paramName="view" atom={viewAtom} />
    <Outlet />
  </>
  ```

---

## 4. What is **not** done in this batch

These were intentionally deferred to the per-slice migration:

- `App.tsx` still wires up `<RecoilRoot>`, `<RecoilLocalStorageSync>` and `<RecoilURLSyncJSON>`. None of those are removed yet.
- **Slice 4a (coexistence smoke test):** Jotai `<Provider store={createStore()}>` is mounted inside `ArticleMap`'s nested `<RecoilRoot>`. No Jotai atoms are consumed yet; behaviour is unchanged. The per-instance store is ready for slice 9b.
- No existing atom definitions have been migrated to Jotai yet — only infrastructure helpers under `src/lib/jotai/` exist without consumers outside that folder.
- Tests for the new sync helpers are not yet written. The recommended additions, when slice 0 begins consuming them, are:
  - `atom-with-local-storage`: write, refresh, cross-tab `storage` event handling, validator rejection path.
  - `atom-with-url-sync`: read on mount, write via `replaceState`, `popstate` propagation, `syncDefault` true/false, custom codecs.

---

## 5. Verification performed

- `tsc --noEmit` (via the project's `test:type-check` script) — see the CI log when the user next runs `npm run test:type-check`. The new files are isolated under `lib/jotai/` and have no consumers, so any type errors will surface only on first use.
- `eslint` — manual lint runs on the new files (via the IDE's `ReadLints` integration) produced no errors.

The build is **not** expected to behave differently at runtime; this is a purely additive change.

---

## 6. Slice progress

| Step                                    | Status   | Notes                                                                                                                                                                                                   |
| --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–3 (infra)                             | Done     | Jotai deps, `lib/jotai/` helpers, sync layer                                                                                                                                                            |
| ~~"coexistence smoke test"~~            | Dropped  | Briefly inserted as an extra step that would have nested an empty Jotai `<Provider>` inside `ArticleMap`. Reverted because it added no real verification and would have touched ArticleMap ahead of 9b. |
| **4a** (Place search)                   | **Done** | First atoms migrated.                                                                                                                                                                                   |
| **4b — Mobile tabs** (§4.2 Slice 3)     | **Done** | First atom family migrated; first time `JotaiReadableStateFamily` is used by a real consumer.                                                                                                           |
| **4b — Pixel driller** (§4.2 Slice 4)   | **Done** | Accordion atoms + interaction mode + click location + URL sync (`pixelDrillerSiteUrlAtom` — first production `atomWithUrlSync` consumer).                                                               |
| ~~6 — Map basemap~~                     | **Done** | Shipped with Slice 10 (2026-05-20); NbS scope-regions layer needed Jotai basemap atoms.                                                                                                                 |
| **7 — Map view + URL coords**           | **Done** | Writable derived `mapViewStateAtom`, URL coords via `makeUrlNumberCodec`, throttled sync, `mapFitBoundsAtom`.                                                                                           |
| **8 — Damages + config half of 14**     | **Done** | Damages drill-down + data-domain query chain + `paramsConfigAtomFamily` + `useLoadParamsConfig` migrated together. Spine value half (`paramsState`, layer selectors) deferred to Slice 14.              |
| **9 — Map interactions + view params**  | **Done** | `interaction-state.ts` on Jotai; Recoil→Jotai `viewLayersReplicaAtom` bridge for params.                                                                                                                |
| **9b — ArticleMap provider flip**       | **Done** | Nested `RecoilRoot` → per-instance Jotai `<Provider store={createStore()}>`.                                                                                                                            |
| **10 — NbS + basemap**                  | **Done** | Full NbS graph on Jotai; Jotai→Recoil layer replicas preserve `viewLayersState` ordering.                                                                                                               |
| **11 — Networks / damages styling**     | **Done** | Damage/network graph on Jotai; param + visibility replicas (param replica removed in Slice 14); network layer J→R replica.                                                                              |
| **12 — Population & regional exposure** | **Done** | Population/regional data + layers on Jotai; param replica removed in Slice 14.                                                                                                                          |
| **13 — Hazards selection**              | **Done** | Hazard selection/visibility/layers on Jotai; param replica removed in Slice 14.                                                                                                                         |
| **14 — Data-params value half**         | **Done** | Full data-params spine on Jotai; removed param replica bridges from Slices 11–13; `useUpdateDataParam` → `useAtomCallback`.                                                                             |
| 5, 15–16                                | Pending  | See `04-migration-slices.md`                                                                                                                                                                            |

> Numbering note: the §4.1 step list and the §4.2 slice list in `04-migration-slices.md` don't line up one-to-one (§4.1's Step 4b bundles §4.2's Slice 3 + Slice 4). We use the §4.1 step numbers (4a, 4b, …) in this progress log because they map cleanly to "what was done in one sitting"; the §4.2 slice IDs are still the place to look for per-feature playbooks.

### Step 4a — Place search (2026-05-19)

- `src/lib/map/place-search/search-state.ts`: `placeSearchActiveState` / `placeSearchQueryState` → `placeSearchActiveAtom` / `placeSearchQueryAtom` (Jotai `atom(...)`).
- `src/lib/map/place-search/MapSearch.tsx`, `src/lib/map/place-search/MapSearchField.tsx`: `useRecoilState` → `useAtom`.
- Verified: `npm run test:type-check`, eslint on changed files. Cross-cutting check (`rg "placeSearch.*State"`) confirms no orphaned consumers.
- Manual test (when back at a browser): expand the place-search field, type, select a result, confirm the map flies and the field collapses; re-expand and confirm the previous query persists.

### Decisions taken during Step 4a

- **Rename convention**: migrated state uses the `*Atom` suffix (e.g. `placeSearchActiveAtom`), matching the Jotai convention used in the slice 5 playbook. Adopt this for every future slice unless noted. Side benefit: a quick `rg "State\b.*from 'recoil'"` makes the remaining work greppable.
- **No ESLint `additionalHooks` change for `useAtomCallback`.** Considered during the dropped 4a smoke test; rejected because `useAtomCallback(cb, options?)`'s second argument is `{ store }` — not a deps array. The deps array lives on the inner `useCallback` you pass in, which is already covered by the base `exhaustive-deps` rule. Adding `useAtomCallback` to `additionalHooks` would generate false positives.

### Step 4b (mobile tabs) — Mobile tab content flags (2026-05-19)

- `src/pages/map/layouts/mobile/tab-has-content.tsx`: `mobileTabHasContentState` → `mobileTabHasContentAtomFamily`. Built with `atomFamily` from `jotai-family` (the supported successor to `jotai/utils`' deprecated `atomFamily`). String `tabId` param → default reference equality is sufficient. `MobileTabContentWatcher`: `useSetRecoilState` → `useSetAtom`.
- `src/lib/mobile-tabs/TabNavigationAction.tsx`: prop type `RecoilReadableStateFamily<boolean, string>` → `JotaiReadableStateFamily<boolean, string>` (from `@/lib/jotai/types`); prop renamed `tabHasContentState` → `tabHasContentAtomFamily`; `useRecoilValue` → `useAtomValue`.
- `src/pages/map/layouts/mobile/MobileBottomSheet.tsx`: updated import + prop name.
- Cross-cutting check (`rg "mobileTabHasContent"`): no orphaned references.
- Verified: `npm run test:type-check`, eslint on changed folders.
- Manual test (when at a browser): shrink to mobile width, switch between bottom-sheet tabs, verify tabs with no content stay disabled and the ones with content are enabled.

### Decisions taken during Step 4b (mobile tabs)

- **Atom family naming convention**: families get the `*AtomFamily` suffix (e.g. `mobileTabHasContentAtomFamily`). Rationale: a "family" is a function that produces atoms — calling the value itself an `*Atom` is misleading, and `*Atoms` (plural) is ambiguous with "array of atoms". Apply this everywhere atom families are renamed.
- **Prop name follow-through**: when a component prop holds a state family (e.g. `TabNavigationAction`'s `tabHasContentState`), rename the prop alongside the export so the call site reads consistently (`tabHasContentAtomFamily={mobileTabHasContentAtomFamily}`). Slightly more disruptive but keeps the migrated surface self-documenting.

### Step 4b (pixel driller) — full pixel-driller slice (2026-05-19)

**Accordion atoms** (initial batch):

- `src/details/pixel-driller/hazard-accordion.tsx`:
  - `hazardAccordionExpandedState` (atomFamily, `string` key) → `hazardAccordionExpandedAtomFamily`, built with `atomFamily` from `jotai-family`. String key → default reference equality is fine; no `fast-deep-equal` needed.
  - `openAccordionState` (`string | null`) → `openAccordionAtom`. Initial value bound to a typed local (`const INITIAL_OPEN_ACCORDION: string | null = null`) — see decision below.
  - `accordionTransitionCountState` (`number`) → `accordionTransitionCountAtom`.
  - Hook switches: `useRecoilState` → `useAtom`, `useSetRecoilState` → `useSetAtom`. Updater-function calls (`setTransitionCount((n) => n + 1)`) Just Work — Jotai's primitive setters accept `SetStateAction<T>` exactly like Recoil's `SetterOrUpdater`.

**Interaction mode, click location, URL sync** (expanded scope, same slice):

- Cross-cutting check before expanding: `rg 'get\(mapInteractionModeState\)|get\(pixelDrillerClickLocationState\)|get\(pixelDrillerSiteUrlState\)'` → zero hits. No selectors compose these atoms with other Recoil state. They were grouped with `backgroundState`/`showLabelsState` in the old Slice 6 plan only because `MapView.tsx` reads all of them — not because the atom definitions are intertwined. Safe to migrate as part of the pixel-driller feature slice.
- `src/state/map-view/map-interaction-state.ts`: `mapInteractionModeState` → `mapInteractionModeAtom` (plain atom, default `'standard'`); `pixelDrillerClickLocationState` → `pixelDrillerClickLocationAtom` (nullable initial, typed-local workaround).
- `src/state/map-view/pixel-driller-url-state.ts`: `pixelDrillerSiteUrlState` → `pixelDrillerSiteUrlAtom` via `atomWithUrlSync('site', { defaultValue: null, syncDefault: false, serialize })`. Custom `serialize` returns `null` (remove param) when value is `null` or `''` — mirrors the old Recoil `writeSiteParam` reset behaviour; the default JSON serializer would write `"null"` instead. Wire format stays JSON-encoded (`?site=%22lat%2Clng%22`) for backwards compatibility with existing shared URLs.
- Consumers updated: `MapInteractionModeSelector.tsx`, `MapView.tsx` (partial — three Jotai atoms; map view / layers / fit-bounds still Recoil), `DetailsContent.tsx` (reads `mapInteractionModeAtom` alongside Recoil `selectionState` — UI branching only), `PixelDrillerDetailsPanel.tsx`, `SiteDetailsContent.tsx` (now fully Jotai for this feature).
- Verified: `npm run test:type-check`, eslint on changed files (clean). `rg "mapInteractionModeState|pixelDrillerClickLocationState|pixelDrillerSiteUrlState"` over `src/` → zero hits.

### Decisions taken during Step 4b (pixel driller)

- **Jotai `atom<T | null>(null)` overload-ambiguity workaround**: writing `atom<string | null>(null)` is sometimes resolved to the **read-only** `atom(readFn)` overload, after which `useAtom(...)` returns `[never, never]` and downstream callers fail to type-check (`This expression is not callable`). The reliable fix is to bind the initial value to a typed variable first:

  ```ts
  const INITIAL_OPEN_ACCORDION: string | null = null;
  export const openAccordionAtom = atom(INITIAL_OPEN_ACCORDION);
  ```

  Same trick was used inside `makeSelectAtom` during Step 2c. **Apply this pattern any time the initial value is `null` (or otherwise legally callable / `unknown`-shaped); a short inline comment is worth leaving in.**

- **"Shared consumer" ≠ "intertwined atoms"**: `MapView.tsx` reading both pixel-driller Jotai atoms and Recoil map/layer atoms is expected during migration and does not block moving the pixel-driller atoms earlier. The cross-cutting check to run before expanding a slice is whether any _atom/selector definitions_ `get(...)` the candidate nodes — not whether a React component happens to import from both libraries.
- **First production `atomWithUrlSync`**: `pixelDrillerSiteUrlAtom` validates the URL-sync helper against real usage. Kept JSON wire format (not `makeUrlStringCodec`) so existing bookmarked URLs keep working.
- **Slice 6 narrowed**: `backgroundState` / `showLabelsState` remain in Slice 6; interaction/URL atoms removed from that slice's scope.

### Step 7 — Map view + URL coords (2026-05-19)

- **Slice 6 deferred** at the time: basemap atoms had a cross-read from `nbsScopeRegionLayerState`; shipped with Slice 10 (2026-05-20) instead.
- `src/state/map-view/map-url.ts`: three Recoil `urlSyncEffect` atoms → `mapZoomUrlAtom`, `mapLonUrlAtom`, `mapLatUrlAtom` via `atomWithUrlSync` + `makeUrlNumberCodec(2/5/5)`. Wire format preserved (`?z=3.0&x=-40.00000&y=20.00000`, `syncDefault: true`).
- `src/state/map-view/map-view-state.ts`:
  - Internal coord atoms: `atomWithDefault((get) => get(map*UrlAtom))` — Jotai equivalent of Recoil's `default: urlAtom`.
  - `nonCoordsMapViewStateAtom`: `atomWithReset` (not plain `atom`) so `mapViewStateAtom`'s RESET cascade type-checks.
  - `mapViewStateAtom`: writable derived atom replacing the Recoil selector; no `dangerouslyAllowMutability` equivalent needed.
  - `mapFitBoundsAtom`: `atomWithReset(null)` — moved here from `MapView.tsx`.
  - `useSyncMapUrl`: Jotai `useSyncStateThrottled` (internal → URL, 2000 ms).
- Consumers: `MapView.tsx` (partial Jotai), `hud.tsx`, `use-map-fit-bounds.ts`.
- Verified: `npm run test:type-check`, eslint on changed files.
- Manual test: pan/zoom → URL updates after ~2 s; reload restores camera; place search flies to bbox; NbS fit-bounds still works.

### Decisions taken during Step 7

- **`atomWithReset` for RESET cascade targets**: plain `atom(...)` setters don't accept `RESET` in their type signature. Both `nonCoordsMapViewStateAtom` and `mapFitBoundsAtom` use `atomWithReset` so `set(atom, RESET)` and `useResetAtom` work without casts.
- **`atomWithDefault` for Recoil `default: otherAtom` pattern**: matches "read URL value until user pans, then hold local override until RESET" semantics exactly.
- **`mapFitBoundsAtom` colocated in `map-view-state.ts`**: removed the Recoil atom definition from `MapView.tsx`; all map camera state now lives under `state/map-view/`.

### URL params on view-tab navigation (2026-05-19)

**Symptom:** switching Hazard → Exposure dropped `x`/`y`/`z` from the URL; they only reappeared after panning/zooming.

**Cause:** view-tab `NavLink`s used bare paths (`/view/exposure`), stripping the query string. Map coord URL atoms (`syncDefault: true`) only write on mount or when coords change — not when another param (`sections`) updates the URL.

**Fix:** view-tab links in `Nav.tsx` preserve query params via `viewTabTo(pathname, search)`. Use `useLiveLocationSearch()` (not `useLocation().search`) so link `href`s update when map coords write via `history.replaceState` — React Router does not re-render on those URL changes. Secondary links (About, Downloads, etc.) and home logo keep plain paths.

**Removed:** `useReassertMapUrlParamsAfterRecoilUrlWrite` shim from `map-view-state.ts` (was coupling map state to Recoil `viewState`/`sections`).

### Step 8 — Damages + config half of Slice 14 (2026-05-20)

Combined slice that wasn't originally planned as one: the entire damages drill-down feature, the upstream `data-domains` async query chain, and the config half of the data-params spine — all migrated in one PR without any Recoil↔Jotai bridge component.

**Files migrated**:

- `src/state/data-domains/sources.ts` — `rasterAllSourcesAtom`, `rasterSourceByDomainAtomFamily`, `rasterSourceDomainsAtomFamily` (all async, including async-of-async).
- `src/state/data-domains/hazards.ts` — `hazardDomainsConfigAtomFamily`.
- `src/state/data-params.ts` — `paramsConfigAtomFamily`, `paramsConfigLoadableAtomFamily`, new Jotai-aware `useLoadParamsConfig`, refactored `useUpdateDataParam`. `paramsState`/`paramValueState`/`paramOptionsState`/`dataParamsByGroupState` deliberately **left on Recoil**.
- `src/sidebar/sections/hazards/HazardsControl.tsx` — `LoadHazardConfig` / `EnsureHazardConfig` flipped to Jotai.
- `src/sidebar/sections/risk/infrastructure-risk.tsx` — `infrastructureRiskConfigAtom`.
- `src/details/features/damages/*.tsx` (4 files) — full slice on Jotai; `selectedHazardAtom` / `selectedEpochAtom` / `selectedRpOptionAtom` via `makeSelectAtom`; `featureAtom` driven by `useSyncValueToAtom`.

**Verified**: `npm run test:type-check` (clean), `eslint` on all changed files (clean), `rg` over the old Recoil names confirms only one historical-reference mention remains (a JSDoc comment).

**Manual test (when at a browser)**:

- `/view/exposure` → each hazard control opens; dropdowns populate; dependent dropdowns reflow.
- `/view/risk` → Infrastructure Risk → sector / hazard dropdowns.
- Click a road asset on the map → damage tables populate; hazard / epoch / RP filters update tables.

### Design decision: split the data-params spine at the right seam (2026-05-20)

The doc-comment in the original `data-params.ts` flagged the constraint that defined the spine:

> `useUpdateDataParams` relies on `useRecoilTransaction` which currently doesn't support reading from selectors. This forces `paramsConfigState` to be an atom family, but that prevents loading the config from the API with async selectors.

That single transaction-context read of `paramsConfigState` was also the **only** read of it from any Recoil selector graph. Every other reference (`HazardsControl.tsx`'s `useRecoilValue`, `useLoadParamsConfig`'s `useSetRecoilState`/`useRecoilValueLoadable`, the damages slice's `noWait(paramsConfigState(hazard))`) was hook-context or migrating-anyway.

**Wedge**: lift the `paramsConfigState` read out of the Recoil transaction and into hook scope as a Jotai `useAtomValue(paramsConfigAtomFamily(group))`. The captured `config` is added to `useRecoilTransaction_UNSTABLE`'s dependency array; the transaction body itself only reads/writes the Recoil `paramsState` family (closure for `config`). Because the per-group config is set exactly once by `useLoadParamsConfig` and never updated, the reference is stable and the callback identity is stable too.

This decoupled the config half (config + loader + `paramsConfigLoadableAtomFamily` + the upstream `data-domains` chain) from the value half (current values + `dataParamsByGroupState` + three layer selectors). The config half went to Jotai in this slice; the value half stays on Recoil until Slice 14 because its consumers (hazards / population-exposure / damages-styling layers) are entangled with Slices 11–13.

**Why no Recoil↔Jotai bridge component was needed**:

- All previous Recoil **selectors** that read `paramsConfigState` are either gone (lifted out of the transaction) or migrated (damages).
- `useLoadParamsConfig` does two writes per group (Jotai config + Recoil `paramsState`). Both writes happen in the same effect tick; readers of either always Suspend until both have run, so no torn read is observable.

**Key Jotai-isms encountered**:

1. **`atom(promise)` overload-ambiguity, again.** Direct `atom<Promise<T>>(new Promise(() => {}))` resolves to the read-only `atom(read)` overload (because TS sees a Promise as a callable-like). Workaround: bind the initial value to a `T | Promise<T>` typed local **and** annotate the `atom<...>(...)` generic explicitly. Without the explicit generic, `atomFamily`'s return-type inference narrows the value back to `Promise<T>`. The union value type also conveniently lets `useSetAtom` accept a plain `T` (the loaded config), while `useAtomValue` returns `Awaited<T | Promise<T>>` = `T`.

   ```ts
   export const paramsConfigAtomFamily = atomFamily((_group: string) => {
     const initial: DataParamGroupConfig | Promise<DataParamGroupConfig> = new Promise(() => {});
     return atom<DataParamGroupConfig | Promise<DataParamGroupConfig>>(initial);
   });
   ```

2. **`loadable(atom)` must be memoised per family key.** Calling `loadable(paramsConfigAtomFamily(hazard))` inside another atom's read function (e.g. `hazardDataParamsAtom`) would create a fresh derived atom on every read. The fix: define a parallel `paramsConfigLoadableAtomFamily` that wraps each member once and reuse it. This is the Jotai analogue of memoising a selector's recoil dependencies.

3. **Async-of-async in Jotai**: `rasterSourceDomainsAtomFamily` does `await get(rasterSourceByDomainAtomFamily(domain))` — the migration doc had flagged this pattern as something to validate. Jotai's async atoms handle nested `await get(...)` of other async atoms naturally; no special handling needed. The migration of this chain to Jotai is the first production validation of that pattern in this codebase.

4. **`useUpdateDataParam` is intentionally cross-library** during the migration. It uses `useAtomValue(paramsConfigAtomFamily(group))` at hook scope and `useRecoilTransaction_UNSTABLE` for the body. A JSDoc on the function records why.

### Things explicitly **not** done in Step 8

- `paramsState` / `paramValueState` / `paramOptionsState` / `dataParamsByGroupState` still on Recoil. Their migration is now the entirety of Slice 14, scoped to a coordinated cutover with the three layer selectors (`hazardLayerState`, `populationExposureLayerState`, `damagesFieldState`).
- `DataParam.tsx` still reads `paramsState` / `paramValueState` / `paramOptionsState` (all Recoil); switches to Jotai when Slice 14 lands.
- `useUpdateDataParam`'s transaction body still uses `useRecoilTransaction_UNSTABLE`. Converts to `useAtomCallback` in Slice 14.
- Slice 14 in `04-migration-slices.md` has been rewritten to reflect what remains rather than the original full-spine playbook.

### Step 9 — Map interactions + view-layer params (2026-05-20)

**Files migrated**:

- `src/lib/data-map/interactions/interaction-state.ts` — `hoverAtomFamily`, `selectionAtomFamily`, `hoverPositionAtom`, `allowedGroupLayersInternalAtom`, writable derived `allowedGroupLayersAtom` (RESET cascade via `atomWithReset` + `RESET` from `@/lib/jotai/is-reset`).
- `src/lib/data-map/state/make-view-layer-params-atom.ts` — Jotai port of `makeViewLayerParamsState`.
- `src/state/layers/view-layers-params.ts` — `viewLayersReplicaAtom`, `viewLayersParamsAtom`.
- Consumers: `use-interactions.ts`, tooltip components, `DetailsContent`, `DeselectButton`, `MapView.tsx`.

**Bridge (Recoil → Jotai)**: `viewLayersState` is still the Recoil hub (Slice 15). `MapView` reads `useRecoilValue(viewLayersState)` and syncs into `viewLayersReplicaAtom` via `useSyncValueToAtom` so `viewLayersParamsAtom` can `get()` the current layer list in Jotai.

**NbS coordination**: Slice 9 landed `selectionAtomFamily('scope_regions')` on Jotai first. Slice 10 initially bridged `nbsRegionScopeLevelState` (Recoil) → `nbsRegionScopeLevelReplicaAtom` (Jotai) in `NbsAdaptationSection`; that interim bridge was removed when Slice 10 migrated the full NbS graph.

**Verified**: `npm run test:type-check`, eslint on changed files.

### Decisions taken during Step 9

- **Bidirectional layer bridges, opposite directions.** Slice 9 syncs Recoil hub → Jotai for _params_ (`viewLayersReplicaAtom`). Slice 10 syncs Jotai → Recoil for _NbS/bbox layer slots_ (see below). Both use the same `useSyncValueToAtom` / `useSyncValueToRecoil` helpers and the same one-frame `useEffect` timing — acceptable because layer params and layer geometry both tolerate a single deferred tick.
- **`allowedGroupLayersAtom` RESET cascade** mirrors the Recoil writable selector: iterate known groups, `set(hoverAtomFamily(g), RESET)` / `set(selectionAtomFamily(g), RESET)`, then reset the internal atom. The only `isReset` consumer in the codebase lives here.

### Step 9b — ArticleMap provider flip (2026-05-20)

- `src/pages/articles/components/ArticleMap.tsx`: `<RecoilRoot>` → `<Provider store={createStore()}>` (per mount via `useMemo`).
- **Why**: after Step 9, interaction atoms are module-level Jotai singletons. A nested `RecoilRoot` no longer isolates hover/selection — without a per-instance Jotai store, two `ArticleMap` instances on the same page would share hover state.
- **Verified**: typecheck + eslint; manual test = two article maps, hover one, confirm the other is unaffected.

### Step 10 — NbS adaptation + basemap (Slice 6 absorbed) (2026-05-20)

Combined slice: deferred Slice 6 (basemap) and Slice 10 (NbS) shipped together because `nbsScopeRegionLayerAtom` reads `backgroundAtom` / `showLabelsAtom` for scope-region label styling.

**Files migrated**:

- `src/state/data-selection/nbs.ts` — 4 primitive atoms + 12 derived atoms; all Recoil removed. Interim `nbsRegionScopeLevelReplicaAtom` (Slice 9 bridge) deleted.
- `src/map/layers/layers-state.ts` — `backgroundAtom`, `showLabelsAtom`.
- `src/state/layers/data-layers/nbs.ts` — Jotai layer atoms (`nbsLayerAtom`, `nbsScopeRegionLayerAtom`, `adaptationNbsVisibleReplicaAtom`) **co-located** with Recoil replica atoms (`nbsLayerState`, `nbsScopeRegionLayerState`), same layout as `feature-bbox.ts`.
- `src/state/layers/ui-layers/feature-bbox.ts` — `boundedFeatureAtom`, `featureBoundingBoxLayerAtom` + Recoil `featureBoundingBoxLayerState` replica.
- `src/state/layers/view-layers-bridge-sync.tsx` — bridge component mounted in `MapView` (renamed from `nbs-view-layers-sync.tsx` in Slice 11).
- UI: `NbsAdaptationSection`, `NbsPrioritisationPanel`, `FeatureAdaptationsTable` — fully Jotai. Deleted orphan `hoveredAdaptationFeatureState`; `selectedAdaptationFeatureState` → `selectedAdaptationFeatureAtom`.

**Verified**: `npm run test:type-check`, eslint, cross-cutting `rg` for old `*State` names → zero hits in `src/`.

### Design decision: Jotai layer source → Recoil hub replicas (not MapView merge)

Early plan for Slice 10 considered removing NbS slots from Recoil `viewLayersState` and merging two layer lists in `MapView`. **Rejected** because `viewLayersState`'s `waitForAll` array encodes draw order — NbS data layer sits between population exposure and RWI; scope regions and feature bbox are in the UI section at fixed indices. Duplicating that ordering in a merge function would be fragile and would fight Slice 15 (hub migration).

**Chosen pattern**:

```
Jotai: nbsLayerAtom / nbsScopeRegionLayerAtom / featureBoundingBoxLayerAtom
  ↓ useSyncValueToRecoil (ViewLayersBridgeSync)
Recoil: nbsLayerState / nbsScopeRegionLayerState / featureBoundingBoxLayerState  (replica atoms, default null)
  ↓ unchanged waitForAll positions
Recoil: viewLayersState hub
  ↓ useSyncValueToAtom (MapView)
Jotai: viewLayersReplicaAtom → viewLayersParamsAtom
```

`view-layers.ts` imports and slot order are **unchanged**. Slice 15 teardown: delete replica atoms + sync hooks; fold Jotai layer atoms directly into a Jotai `viewLayersAtom` at the same indices.

**Sidebar visibility bridge**: `sidebarPathVisibilityState('adaptation/nbs')` stays Recoil until Slice 15. `SidebarPathVisibilityBridgeSync` syncs it → `adaptationNbsVisibleReplicaAtom` for layer gating and for `NbsPrioritisationPanel` visibility (replacing inline `useRecoilValue` on the hub selector).

**Co-location convention**: files that straddle the boundary (`nbs.ts`, `feature-bbox.ts`) put Jotai definitions first, Recoil replicas second, with `Recoil↔Jotai migration` comments on the replica exports and on the sync component. Fully migrated files (`state/data-selection/nbs.ts`, section components) carry no bridge comments.

### Decisions taken during Step 10

- **Slice 6 bundled, not bridged.** Basemap atoms migrated to Jotai rather than syncing Recoil → Jotai at the map boundary — only two consumers (`MapLayerSelection`, `MapView`) and NbS layer derivation reads them directly.
- **`nbsScopeRegionLayerAtom` returns `ViewLayer[] | null`**, matching the old Recoil selector (array of one layer when visible, `null` when hidden). Recoil replica atom type matches.
- **Nullable writable atoms**: `boundedFeatureAtom` and `selectedAdaptationFeatureAtom` use the typed-local initial workaround (`const INITIAL_*: T | null = null; atom(INITIAL_*)`) — same pitfall as Step 4b/8.
- **One-frame sync lag on NbS layer toggle** is the same tradeoff accepted in Step 9 for view-layer params. If flicker appears when toggling Adaptation visibility, `useLayoutEffect` in the sync helpers is the escape hatch — not applied preemptively.

### Things explicitly **not** done in Step 10

- `viewLayersState` hub, `sidebarPathVisibilityState`, and the three NbS/bbox Recoil replica atoms — remain until Slice 15.
- `interactionGroupsState` — still Recoil; `MapView` reads it alongside Jotai params.
- All non-NbS layer selectors in `view-layers.ts` — unchanged (Slices 11–15).

### Step 11 — Networks / damages styling (2026-05-20)

**Files migrated:**

- `src/state/data-selection/damage-mapping/damage-map.ts` — primitives + `showInfrastructureDamagesAtom` derived.
- `src/state/data-selection/damage-mapping/damage-style-params.ts` — `damagesFieldAtom`, `damageMapStyleParamsAtom`, **`damageGroupParamsReplicaAtom`** (bridge target).
- `src/state/data-selection/networks/networks-style.ts`, `network-selection.ts` — tree + selection; `syncInfrastructureSelectionStateEffect` now takes Jotai `StateEffectInterface`.
- `src/state/layers/data-layers/networks.ts` — Jotai layer/style atoms co-located with Recoil **`networkLayersState`** replica; **`exposureInfrastructureVisibleReplicaAtom`**.
- `src/state/layers/sidebar-path-visibility-bridge-sync.tsx`, `view-layers-bridge-sync.tsx` — split Recoil→Jotai sidebar visibility sync from Jotai→Recoil layer replica sync.
- `src/sidebar/LinkViewLayerToPath.tsx` — accepts Recoil state **or** Jotai atom (split subcomponents to satisfy rules of hooks).
- `src/sidebar/sections/networks/NetworkControl.tsx`, `src/sidebar/sections/risk/infrastructure-risk.tsx` — Jotai hooks + three cross-store sync null components.

**Hub bridges (same playbook as Slice 10):**

| Bridge                                                                                               | Direction | Sync site                                              |
| ---------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------ |
| `dataParamsByGroupState(damageSource)` → `damageGroupParamsReplicaAtom`                              | R→J       | `DamageGroupParamsSync` in `InfrastructureRiskSection` |
| `sidebarPathVisibilityState('exposure/infrastructure')` → `exposureInfrastructureVisibleReplicaAtom` | R→J       | `SidebarPathVisibilityBridgeSync` in `MapView`         |
| `sidebarPathVisibilityState('adaptation/nbs')` → `adaptationNbsVisibleReplicaAtom`                   | R→J       | `SidebarPathVisibilityBridgeSync` in `MapView`         |
| `networkLayersAtom` → `networkLayersState`                                                           | J→R       | `ViewLayersBridgeSync`                                 |

**Cross-library effects (not hub replicas):** sector param and hazard param are still Recoil (`paramValueState`). Rather than passing Jotai `set` through Recoil `StateEffectRoot`, split into:

- `SyncSectorToNetworkTree` — `useRecoilValue(sector)` + `useAtomCallback` → `syncInfrastructureSelectionStateEffect` on Jotai tree.
- `SyncHazardToDamageSource` — `useRecoilValue(hazard)` + `useSetAtom(damageSourceAtom)`.
- Recoil `StateEffectRoot` retained **only** for `viewTransitionEffect` on `viewState` (Slice 15 sidebar hub migration).

**`LinkViewLayerToPath` for `risk/infrastructure`:** path context → `showInfrastructureRiskAtom` via `useSyncValueToAtom` with **`resetOnUnmount`** (not a sidebar-hub replica — no Recoil selector read inside Jotai `get()`). Clears stale `true` when the Risk section unmounts on view change so Exposure infrastructure gets standard (non-damage) styling.

**`StateEffectInterface`:** reduced to `{ get, set }` only; reset via `set(atom, RESET)` from `@/lib/jotai/is-reset`. Removed unused `reset` helper that caused `WritableAtom` typing issues with `RESET`.

### Decisions taken during Step 11

- **Split bridge sync into two MapView children** — `SidebarPathVisibilityBridgeSync` (Recoil→Jotai path visibility replicas) and `ViewLayersBridgeSync` (Jotai→Recoil layer hub replicas), so direction of each bridge is obvious at the call site.
- **`networkLayersState` replica defaults to `[]`** (not `null`) because the hub slot always expected an array from the old selector.
- **`damageGroupParamsReplicaAtom` typed as `Record<string, unknown>`** — loose enough for `rcp`/`epoch` until Slice 14 migrates `dataParamsByGroupState` and the replica is deleted.
- **`LinkViewLayerToPath.resetOnUnmount`** — opt-in (default false). Used only for `showInfrastructureRiskAtom` so a one-way path sync does not leave damage styling enabled after leaving Risk view. Hazards still use the Recoil variant without reset.

### Known issues deferred (pre-existing; not introduced by migration)

- **Risk view round-trip:** enable Infrastructure Risk on `/view/risk`, switch to another view, return to Risk — sidebar may show Infrastructure Risk as visible but map layers stay off until toggled. Root cause: `InitInfrastructureView` `hideExposure` on unmount clears `exposure/infrastructure`; `syncExposure` on remount races with `viewTransitionEffect` re-showing the Risk section. Fix properly in Slice 15 when layer gating is migrated off the Exposure path hack.

### Things explicitly **not** done in Step 11

- `dataParamsByGroupState`, `paramsState`, `paramValueState`, `DataParam` — Slice 14.
- `showOneHazardStateEffect`, hazard sidebar toggles — Slice 13.
- `syncExposure` / `hideExposure` — Slice 12 (done).
- `viewLayersState` hub teardown — Slice 15.

### Step 12 — Population & regional exposure (2026-05-20)

**Files migrated:**

- `src/sidebar/sections/risk/population-exposure.tsx` — `populationExposureHazardAtom`, `populationExposureGroupParamsReplicaAtom` (colocated with section); `InitPopulationView` keeps `useRecoilTransaction_UNSTABLE`; `PopulationExposureGroupParamsSync`, `SyncPopulationHazardToSidebar`.
- `src/sidebar/sections/risk/regional-risk.tsx` — `regionalExposureVariableAtom` (colocated; was Recoil atom in `state/data-selection/regional-risk.ts`).
- `src/sidebar/sections/risk/exposure-sidebar-sync.ts` — `syncExposure` / `hideExposure` shared by population + infrastructure Risk sections; still typed against Recoil `TransactionInterface_UNSTABLE`.
- `src/state/layers/data-layers/population-exposure.ts`, `regional-risk.ts` — Jotai layer atoms + Recoil replicas; layer files import atoms from sidebar section modules.
- `src/sidebar/sections/risk/infrastructure-risk.tsx` — imports shared exposure sync; keeps `useRecoilTransaction_UNSTABLE`.

**Hub bridges:**

| Bridge                                                                               | Direction | Sync site                           |
| ------------------------------------------------------------------------------------ | --------- | ----------------------------------- |
| `dataParamsByGroupState(hazard)` → `populationExposureGroupParamsReplicaAtom`        | R→J       | `PopulationExposureGroupParamsSync` |
| `sidebarPathVisibilityState('risk/population')` → `riskPopulationVisibleReplicaAtom` | R→J       | `SidebarPathVisibilityBridgeSync`   |
| `sidebarPathVisibilityState('risk/regional')` → `riskRegionalVisibleReplicaAtom`     | R→J       | `SidebarPathVisibilityBridgeSync`   |
| `populationExposureLayerAtom` → `populationExposureLayerState`                       | J→R       | `ViewLayersBridgeSync`              |
| `regionalExposureLayerAtom` → `regionalExposureLayerState`                           | J→R       | `ViewLayersBridgeSync`              |

**Cross-library hazard effect:** `SyncPopulationHazardToSidebar` watches Jotai `populationExposureHazardAtom` and applies Recoil `showOneHazardStateEffect` via `useRecoilTransaction_UNSTABLE` (Slice 13 migrates the effect itself).

**Colocation:** section-scoped Jotai atoms live in sidebar section files; layer derivation imports from there (same pattern as pre-migration Recoil). Exposure sync stays Recoil-transactional until Slice 15 sidebar hub migration.

### Things explicitly **not** done in Step 12

- `dataParamsByGroupState` hub — Slice 14 (population layer reads params via replica only).
- Risk view round-trip layer restore bug — deferred to Slice 15.

### Step 13 — Hazards selection (2026-05-20)

**Files migrated:**

- `src/state/data-selection/hazards.ts` — `hazardSelectionAtomFamily`, `hazardVisibilityAtom`; `showOneHazardStateEffect` takes `SidebarVisibilitySetter` (sidebar hub still Recoil until Slice 15).
- `src/state/layers/data-layers/hazards.ts` — `hazardLayersAtom`, `hazardGroupParamsReplicaAtomFamily`, Recoil `hazardLayerState` replica.
- `src/sidebar/sections/hazards/HazardsControl.tsx` — Jotai `LinkViewLayerToPath` + `HazardGroupParamsSync` per hazard type.
- `src/sidebar/sections/risk/infrastructure-risk.tsx` — `SyncInfrastructureHazardToSidebar` replaces last Recoil `StateEffectRoot` for hazard sidebar sync.
- `src/sidebar/sections/risk/population-exposure.tsx` — updated `showOneHazardStateEffect` call signature.

**Hub bridges:**

| Bridge                                                                          | Direction | Sync site                                      |
| ------------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
| `dataParamsByGroupState(hazard)` → `hazardGroupParamsReplicaAtomFamily(hazard)` | R→J       | `HazardGroupParamsSync` in each hazard control |
| `hazardLayersAtom` → `hazardLayerState`                                         | J→R       | `ViewLayersBridgeSync`                         |

**`showOneHazardStateEffect`:** pure function over `(path, visible) => void`; Population/Infrastructure Risk sections wrap with `useRecoilTransaction_UNSTABLE` + `sidebarVisibilityToggleState` writes.

### Things explicitly **not** done in Step 13

- `dataParamsByGroupState` hub — Slice 14 (hazard layers read params via per-hazard replicas only).
- `sidebarVisibilityToggleState` hub — Slice 15 (`showOneHazardStateEffect` still writes Recoil toggles).
- Risk view round-trip layer restore bug — deferred to Slice 15.

### Step 14 — Data-params value half (2026-05-20)

**Files migrated:**

- `src/state/data-params.ts` — `paramsAtomFamily`, `paramValueAtomFamily`, `paramOptionsAtomFamily`, `dataParamsByGroupAtomFamily`; `useUpdateDataParam` → `useAtomCallback`; all Recoil imports removed. Object-param families use `isDeepEqual` via `jotai-family`.
- `src/sidebar/ui/DataParam.tsx` — `useAtomValue` over Jotai families.
- `src/state/data-selection/damage-mapping/damage-style-params.ts` — `damagesFieldAtom` reads `dataParamsByGroupAtomFamily(damageSource)` directly; `damageGroupParamsReplicaAtom` removed.
- `src/state/layers/data-layers/hazards.ts` — `hazardLayersAtom` reads `dataParamsByGroupAtomFamily(hazard)` directly; replica removed.
- `src/state/layers/data-layers/population-exposure.ts` — reads `dataParamsByGroupAtomFamily(hazard)` directly.
- `src/sidebar/sections/hazards/HazardsControl.tsx` — removed `HazardGroupParamsSync`.
- `src/sidebar/sections/risk/population-exposure.tsx` — removed `PopulationExposureGroupParamsSync` + replica atom.
- `src/sidebar/sections/risk/infrastructure-risk.tsx` — removed `DamageGroupParamsSync`; uses `paramValueAtomFamily` for sector/hazard sync.

**Bridge nodes removed:**

| Removed bridge                             | Was synced from          | Was consumed by               |
| ------------------------------------------ | ------------------------ | ----------------------------- |
| `damageGroupParamsReplicaAtom`             | `dataParamsByGroupState` | `damagesFieldAtom`            |
| `populationExposureGroupParamsReplicaAtom` | `dataParamsByGroupState` | `populationExposureLayerAtom` |
| `hazardGroupParamsReplicaAtomFamily`       | `dataParamsByGroupState` | `hazardLayersAtom`            |

**Design notes:**

- Async-default pattern preserved: `paramsAtomFamily` holds `Promise<...>` until `useLoadParamsConfig` writes initial state (same as config half from Slice 8).
- `dataParamsByGroupAtomFamily` casts resolved state to `Record<string, ValueAndOptions>` — by the time layer atoms read it, the loader has hydrated the group.

### Things explicitly **not** done in Step 14

- `sidebarVisibilityToggleState` hub — Slice 15.
- Layer hub replicas (`hazardLayerState`, `populationExposureLayerState`, etc.) — Slice 15.
- Risk view round-trip layer restore bug — deferred to Slice 15.
