# Migration Risks & Verification Strategy

How to validate that the migrated Jotai code behaves the same as the Recoil original — and where a literal port is the wrong move.

This document complements `04-migration-slices.md` (ordering & playbook) and `05-implementation-notes.md` (what was already built). Read those first.

---

## 1. Layered verification

No single check covers everything. Build out these layers in order of cost vs. coverage; the first few are cheap and high-value.

### 1.1 Side-by-side coexistence as a debugging tool

The migration plan keeps `<RecoilRoot>` mounted alongside Jotai's `<Provider>` during the per-slice rollout. Beyond the obvious benefit of "the app still works while we migrate", coexistence is also the best diagnostic tool you have:

- Comment out the Jotai version of a slice, refresh, and confirm a bug is in the new code rather than pre-existing.
- A/B compare two branches at the same URL/state.
- Use both Recoil DevTools and Jotai DevTools simultaneously.

Cost: two store instances in memory for the duration of the migration. Value: enormous for diagnosing "did I break X, or was X already broken?".

### 1.2 Type-level guards

Lean on the compiler:

- Type the `args` tuple of every writable atom explicitly. `[T | typeof RESET]` is more honest than `[T]` for atoms that accept `RESET`.
- Use `Atom<T>` in read-only slots instead of `WritableAtom<...>` so accidental writes fail at compile time. The new `JotaiStateFamily` / `JotaiReadableStateFamily` distinction (in `src/lib/jotai/types.ts`) is exactly for this.
- Watch for Jotai's `atom()` overload ambiguity when a free generic + `null` meet. Concrete example in `src/lib/jotai/make-state/make-select-atom.ts`: `atom<T | null>(null)` resolved to the read-only overload until the value was extracted into a typed local. Apply the same trick anywhere you hit this.

### 1.3 Unit tests for the helpers themselves

The new helpers in `src/lib/jotai/sync-stores/` are exactly the right shape for isolated tests. Vitest is already installed and there's a `coverage` script. Recommended test coverage per helper:

| Helper                 | What to test                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `atomWithLocalStorage` | round-trip, date revival, cross-tab `storage` event, validator rejection falls back to default, `RESET` removes the key                                                                      |
| `atomWithUrlSync`      | hydrate from URL on mount, `replaceState` on write, `popstate` propagation, `syncDefault: true/false`, multi-atom write ordering, custom codecs (`makeUrlNumberCodec`, `makeUrlStringCodec`) |
| `make-select-atom`     | options shrinks → falls back to default, `RESET` clears selection, options grow → keeps current selection                                                                                    |
| `state-effects`        | effect fires on change, `previousValue` correctness, hookType `'effect'` vs `'layoutEffect'`, reset via `set(atom, RESET)`                                                                   |

`@testing-library/react` + a per-test Jotai `Provider` is the canonical setup (~10 lines of boilerplate). The project doesn't yet have that scaffolding; adding it is a small one-off cost for the whole migration.

### 1.4 Component-level integration tests for trickier slices

For each slice in `04-migration-slices.md`, write a happy-path render test:

- **Map URL slice** — render the map, confirm URL updates on pan/zoom, confirm back/forward restores state.
- **Job tracking slice** — submit a job, verify `localStorage` payload, force a `storage` event from another tab, confirm `usePruneOldJobs` still fires.
- **View transition slice** — change `viewState`, confirm sidebar expanded/visibility atoms flip together as one observable change (per the `viewTransitionEffect` in `src/sidebar/SidebarContent.tsx`, lines 302–321).

### 1.5 Manual smoke tests with a per-slice checklist

The truly emergent behaviors (Suspense fallbacks, async parameter loading, layer compositing) are easier to validate by hand. Write a short scripted scenario for each slice — open the app, click these things, observe these URLs/values — and run it twice (once on `main`, once on the slice branch).

### 1.6 Lightweight production telemetry (optional)

A few `console.assert` / `console.warn` lines in the new helpers (gated on `NODE_ENV !== 'production'`) can catch regressions silently. Concrete suggestion: in `atomWithUrlSync`, warn if a `popstate` triggers a value change for an atom whose URL param wasn't present before. That catches "we lost the URL key during a write" bugs cheaply.

---

## 2. Can Recoil be replaced 1:1? — Honest risk tiers

The bulk of the code ports mechanically, but it's worth knowing where the bodies are buried before starting. Below, every Recoil API actually used in the project is sorted into one of four tiers.

### Tier A — clean 1:1 (the bulk of the code)

- `atom`, `selector`, read-only `selectorFamily`, simple writable selectors
- `useRecoilValue` / `useSetRecoilState` / `useRecoilState`
- `useResetRecoilState`
- The simpler sync/throttled helpers in `lib/recoil/state-sync/`

The Jotai equivalents preserve identical observable semantics. Most of the codebase falls here. Slices that touch only Tier A code should require minimal review.

### Tier B — semantics shift slightly, but most call sites won't notice

- **`useRecoilCallback` / `useRecoilTransaction_UNSTABLE`** (4 distinct call sites: `data-params.ts`, `jobs.ts`, `population-exposure.tsx`, `infrastructure-risk.tsx`). Jotai's `useAtomCallback` provides the same `(get, set)` interface, but Recoil's `transact_UNSTABLE` guaranteed _no observer sees intermediate state_; Jotai's store updates after every `set`. In practice React batches the renders, so the **visible** result is the same. The risk: a derived atom that reads two atoms updated sequentially in one callback. In this codebase the riskiest example is `viewTransitionEffect` (`SidebarContent.tsx` 302–321) flipping many `sidebarVisibilityToggleState(path)` atoms while the derived `sidebarSectionsUrlOutwardState` (in `sidebar/url-state.tsx`) reads them all. Expect the URL replica to fire several times during a transition instead of once.

- **`useRecoilValueLoadable`** (e.g. `data-params.ts:59`). Jotai's `loadable(atom)` produces an atom you read with `useAtomValue`. Result shape is `{ state: 'loading' | 'hasError' | 'hasData', data, error }` instead of `{ state, contents }`. Mechanical change, type-safe.

- **`noWait`** (`DamagesSection.tsx:25`). Same idea as `useRecoilValueLoadable` but inline in a selector. The Jotai equivalent is `loadable(myAtom)` referenced inside a derived atom. Same semantics.

- **`waitForAll`** (`view-layers.ts:1`). In Jotai, async-atom `get`s return Promises directly, so `Promise.all([...])` inside an `async` derived atom replaces this. Simpler, actually.

### Tier C — needs care, requires per-site review

- **`dangerouslyAllowMutability: true`** (`map-view-state.ts:28`). This exists because the selector returns an object that consumers like deck.gl mutate in place. Jotai doesn't have an "I know what I'm doing" escape hatch; you have to either freeze the object (and pay the cost) or accept that Jotai's equality checks won't catch external mutation. **Solution**: clone in consumers, or use `atomWithDefault` + a manual update path. Either way, the existing "deck.gl mutates my state and I don't tell Recoil" pattern needs to change.

- **`paramsConfigState` async atom families that throw `new Promise(() => {})` as default** (`data-params.ts:23-26`). This is a Recoil trick to "block on Suspense forever until externally set". In Jotai, the idiomatic equivalent is an atom holding `Promise<DataParamGroupConfig>` that's only resolved when the loader fires. The existing comment on lines 44–47 already flags this as a workaround for Recoil's transaction limitations. **One of the cases where the right move is to redesign the storage shape**, not port it — see §3.

- **`atomFamily` with object params** — `paramValueState({ group, param })` in `data-params.ts`. In Recoil this works via reference identity (the same object passed twice creates two atoms unless you use `dangerouslyAllowMutability`). The Jotai equivalent (via `jotai-family`) needs `isDeepEqual` from `fast-deep-equal` — already installed as a direct dep. Mechanical change but easy to miss.

- **`recoil-sync` `urlSyncEffect` with `refine` validators**. Porting to `atomWithUrlSync` is straightforward, **except** that `@recoiljs/refine` does structural validation (e.g. `dict(union(bool(), lazy(...)))` in `sidebar/url-state.tsx`). Either keep `@recoiljs/refine` and wrap as a TypeScript type predicate, or rewrite those checkers as plain TS guards. The latter is more work but removes a dependency.

### Tier C-cross — atom definitions shared across "isolated" subtrees

A subtle one that almost mis-sequenced the migration. **`<RecoilRoot>` (and Jotai's `<Provider>`) isolate runtime _values_, not module-level atom _definitions_.** An atom exported from a module is a singleton. Whatever library defines it dictates the hooks every consumer must use, regardless of which store provider is mounted above.

Concrete case in this codebase: `ArticleMap` mounts its own nested `<RecoilRoot>` so its hover/selection state doesn't leak into the main map's store. The original migration plan listed ArticleMap as the pilot on the assumption that this isolation extended to the migration boundary. It doesn't: `hoverState` and `selectionState` are defined in `lib/data-map/interactions/interaction-state.ts` and imported by 8 other files in the main app. Migrating ArticleMap means migrating all 8 simultaneously — i.e. Slice 9 in `04-migration-slices.md` (see §4.3 of that doc for the full reasoning).

**General rule**: before treating a slice as independent, run

```bash
rg --files-with-matches "import.*<atomName>" src/
```

for every atom the slice imports from outside its own folder. If any hit lands outside the slice's listed files, the slice has a hidden dependency. Other examples in this codebase: `terracottaColorMapValuesQuery` is read in both the main map and `ArticleMap`; `mapFitBoundsState` is set by Place search but read by `MapView`.

### Tier D — semantics that cannot be ported 1:1

A small handful of places where you must actively decide rather than translate.

- **State effects with `transact_UNSTABLE` semantics on cascading derived atoms.** Concretely, `viewTransitionEffect` sets many `sidebarVisibilityToggleState(path)` atoms in a loop. A derived selector observing all of them (`sidebarSectionsUrlOutwardState`) sees N intermediate states in Jotai instead of 1 in Recoil. If you can tolerate the extra URL writes (cheap) and re-renders (also cheap, React batches them), you're fine. If a side-effect-y derived atom truly needs atomicity, redesign.

- **Suspense-on-mount where the atom's value is "Promise that will be settled later from outside"** — `paramsConfigState`'s `default: () => new Promise(() => {})` pattern. Jotai _can_ hold a Promise atom that's externally resolved, but you'd be fighting both libraries' ergonomics. Better to flatten this.

- **`dangerouslyAllowMutability` + reference-stable selector pattern** — fundamentally Recoil-specific.

---

## 3. Cases worth **rethinking** rather than porting

Don't translate these mechanically; the new model unlocks something simpler.

### 3.1 The whole `StateEffectRoot` indirection in many places

The `StateEffectRoot` pattern exists largely because Recoil hooks don't compose with imperative event-driven logic outside React. With Jotai's `useAtomCallback`, you can put the logic where it's triggered. Compare:

```tsx
// today (infrastructure-risk.tsx 119-122):
<StateEffectRoot
  state={paramValueState({ group: 'infrastructure-risk', param: 'sector' })}
  effect={syncInfrastructureWithSectorEffect}
/>
```

This is a mount-only component watching one atom for changes and reacting. In Jotai it could be a simple `useEffect`:

```tsx
const sector = useAtomValue(paramValueState({ group: 'infrastructure-risk', param: 'sector' }));
const sync = useAtomCallback(
  useCallback((get, set) => {
    /* effect */
  }, []),
);
useEffect(() => {
  sync();
}, [sector, sync]);
```

That is strictly clearer and avoids "ghost components" in the render tree. The current `lib/jotai/state-effects/` port works as a **migration crutch** (so consumers swap imports and move on). Once a slice is migrated, consider whether the indirection is still worth it.

### 3.2 The `paramsConfigState` async-atom-family hack

Per the inline comment in `data-params.ts:44-47`, the current design is an explicit workaround for `useRecoilTransaction` not supporting selectors. Jotai doesn't have that limitation. The whole "atomFamily of promises that never resolve, populated by an effect" pattern can be replaced with a single async atom that reads from the API and returns the config, plus a writable atom holding the current values. Far less indirection.

### 3.3 The "selectedImpl + defaultImpl + result" tri-atom pattern in `makeSelectState`

The new `makeSelectAtom` is a 1:1 port, but Jotai has `atomWithDefault((get) => defaultFn(get(optionsAtom)))` which collapses it to two atoms and arguably reads cleaner. Worth considering for new call sites.

### 3.4 `RecoilURLSyncJSON` / `RecoilLocalStorageSync` providers at the App root

Already addressed by `atom-with-url-sync.ts` / `atom-with-local-storage.ts` — per-atom sync removes the need for global provider components, removes the "shared storeKey" coupling, and is easier to reason about. Don't preserve the centralized-provider model.

### 3.5 `MapViewRouteSync` writing into an atom

The existing `viewState` atom mostly exists to bridge React Router's `useParams()` into atoms that get composed in selectors. With Jotai, you could just call `useParams()` directly where needed, or thread the value through React context. The atom isn't pulling its weight — it adds a sync boundary for one string. Whether to keep this is a stylistic call; `RouteParamSync` makes the migration low-friction, but you may find half its usages disappear naturally once you start porting.

### 3.6 The map view-state writable selector with `reset` cascading

`mapViewStateState` (`map-view-state.ts:26-52`) sets four downstream atoms on reset/set. In Jotai this is still expressible, but with `dangerouslyAllowMutability: true` gone, you'll want to be explicit about object identity. Consider whether you want `mapViewStateState` to be a single atom holding the whole state (one source of truth) instead of a composite over four separate atoms. The current design dates from when deck.gl + Recoil interop forced the split.

### 3.7 `dataParamsByGroupState`, `paramOptionsState`, `paramValueState` as selectorFamily over a `paramsState` family

That's three families of derived selectors over an atom family of records-of-records. Once on Jotai, you can either:

- Keep three derived atom families (mechanical port), or
- Replace with a single `atom<Record<string, Record<string, ValueAndOptions>>>` and let consumers index in.

The current shape was driven by the same `useRecoilTransaction` selector-read limitation. Flattening would simplify the data flow.

### 3.8 The DataMap interaction-state coupling (post-migration, optional)

Today every consumer of `DataMap` shares one module-level set of interaction atoms (`hoverState`, `selectionState`, `hoverPositionState`, `allowedGroupLayersState`). This is why ArticleMap currently needs a nested `<RecoilRoot>` to isolate runtime state, and why the post-Slice-9 isolation needs a nested `<Provider>` (Slice 9b). The store-provider trick works but it's a leaky abstraction — it depends on every consumer following the convention of using hooks rather than direct `store.get(atom)` calls, and it ties the data-map library to whatever state library is providing the atoms.

A cleaner long-term shape — **not required for the migration, but worth keeping in mind** — is to thread the atoms in via a React context:

```ts
interface InteractionAtoms {
  hover: AtomFamily<string, WritableAtom<InteractionTarget[], [...]>>;
  selection: AtomFamily<string, WritableAtom<InteractionTarget, [...]>>;
  hoverPosition: PrimitiveAtom<HoverAnchorLngLat | null>;
  allowedGroupLayers: WritableAtom<AllowedGroupLayers, [...]>;
}

const InteractionAtomsContext = createContext<InteractionAtoms>(defaultGlobalAtoms);

// Each consumer of useInteractions / DataMapTooltip / InteractionGroupTooltip /
// DetailsContent / DeselectButton / view-layers-params reads the atoms from context
// instead of importing them from the module.
```

The main map provides nothing (uses the default context); ArticleMap provides its own per-instance `InteractionAtoms` object built via factory functions. The provider-nesting trick disappears entirely. The data-map library becomes agnostic to the host state library, which would make extracting it into its own package (if that ever becomes interesting) straightforward.

**Cost**: a moderate refactor of `useInteractions` and ~6 consumer files. **Scope**: post-migration cleanup. **Don't bundle this into Slice 9** — it would balloon the slice from "rewrite atoms" to "rewrite atoms + add a context layer", and the migration is hard enough already.

---

## 4. Summary recommendation

- **The mechanical 1:1 port is feasible for ~80% of the codebase.** The helpers in `src/lib/jotai/` are the right scaffolding for that bulk.
- **Tier C requires per-site judgement.** Budget extra time for these files: `data-params.ts`, `map-view-state.ts`, `view-layers.ts`, `DamagesSection.tsx`.
- **Tier D is small but real** — fewer than ~5 places. For each, document the deliberate change (similar to `05-implementation-notes.md`'s style) before doing the work, so reviewers know what's intentional vs. accidental drift.
- **Verification is best layered**: type guards first (free), helper unit tests second (cheap, high value), integration tests for the trickiest slices third, manual smoke last. Coexistence mode is your best diagnostic tool throughout.
- **Some patterns are better replaced than translated.** The seven items in §3 all exist because of Recoil quirks. Doing the migration is the right time to delete them — but don't expand the scope of a single slice; mark them as follow-ups in the slice's playbook and tackle them after the slice ports.

---

## 5. Cross-references

- `01-recoil-inventory.md` — every Recoil API and helper actually used in the project, with file pointers.
- `02-jotai-mapping.md` — per-API mapping table with difficulty ratings.
- `03-state-graph.md` — visualizes which atoms/selectors are connected, used to identify migration slice boundaries.
- `04-migration-slices.md` — recommended migration order with a per-slice playbook.
- `05-implementation-notes.md` — what was built in the first three steps (deps, ported helpers, sync layer) and the decisions taken.
