# Recoil → Jotai migration analysis

This folder holds the analysis of recoil usage in `irv-frontend`, produced as a one-off planning artifact to scope and sequence a migration to [Jotai](https://jotai.org/). Snapshot taken **2026-04-23**, against `recoil@^0.7.7`, `recoil-sync@^0.2.0`, `@recoiljs/refine@^0.1.1` (versions pinned in [`package.json`](../../../package.json)).

## How to read this folder

| File                                                 | What's in it                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`01-recoil-inventory.md`](./01-recoil-inventory.md) | Every file that imports `recoil`, `recoil-sync`, `@recoiljs/refine`, or `@/lib/recoil/*`, with imported symbols; API usage counts; every atom/selector/family defined in `src/`; the `RecoilRoot`/sync wrapper nesting; a per-file catalog of `src/lib/recoil/` with consumers; notable behaviour subtleties.                           |
| [`02-jotai-mapping.md`](./02-jotai-mapping.md)       | Per-API mapping table (Recoil → Jotai) with difficulty and code sketches; per-file replacement strategy for every helper in `src/lib/recoil/`; a one-page cheat-sheet.                                                                                                                                                                  |
| [`03-state-graph.md`](./03-state-graph.md)           | Methodology for the dependency graph; top-level + 14 per-cluster mermaid diagrams; the list of bridge/hub nodes that constrain the migration order; pointers to the machine-readable data files.                                                                                                                                        |
| [`04-migration-slices.md`](./04-migration-slices.md) | Recommended migration order (16 steps); 13 independent migration slices each with risk, files, helpers, and a step-by-step playbook + test plan; a reusable per-slice playbook template.                                                                                                                                                |
| [`data/state-graph.json`](./data/state-graph.json)   | Source of truth for the graph: 152 nodes (atoms / selectors / families / boundary providers), 201 edges (typed `get`/`set`/`default`/`effect`/`syncReplica`/`urlSync`/`localStorageSync`/`routeSync`/`providerValue`), and 100 component-consumer pairs. **Stale for downloads-jobs cluster** (decommissioned 2026-06-02) until re-run. |
| [`data/state-graph.dot`](./data/state-graph.dot)     | Graphviz `digraph` derived from the JSON, with one cluster subgraph per slice. Renders to `state-graph.svg` with `dot -Tsvg`.                                                                                                                                                                                                           |

## TL;DR

- **Footprint:** 117 files import `recoil`, 8 import `recoil-sync`, 5 import `@recoiljs/refine`, 23 import `@/lib/recoil/*`. ~43 `atom`, 12 `atomFamily`, 62 `selector`, 13 `selectorFamily`. 6 `useRecoilTransaction_UNSTABLE` call sites; 1 `noWait`; 1 `waitForAll`; 1 `dangerouslyAllowMutability`. No `useRecoilSnapshot`/`useGotoRecoilSnapshot`/`useRecoilRefresher_UNSTABLE` usage.
- **Sync surface:** fully on Jotai per-atom helpers (`atomWithUrlSync`, `atomWithLocalStorage`, `RouteParamSync`). Recoil removed in Slice 16 (2026-06-02): no `RecoilRoot`, no `recoil-sync` providers, `src/lib/recoil/` deleted.
- **Migration complete (Slice 16):** all feature state on Jotai. Removed packages: `recoil`, `recoil-sync`, `@recoiljs/refine`.
- **Downloads (Slice 5):** not migrated — job-tracking Recoil removed; dataset accordion state is inline Jotai in [`ProcessorVersionListItem.tsx`](../../../src/modules/downloads/sections/datasets/ProcessorVersionListItem.tsx). See [`04-migration-slices.md`](./04-migration-slices.md) § Slice 5.
- **Easy wins to migrate first** (no inbound hub edges): place search, mobile tab content flags, pixel-driller accordion. (Articles map was Slice 9b; downloads jobs no longer apply.)
- **One nested `RecoilRoot`** in [`src/pages/articles/components/ArticleMap.tsx`](../../../src/pages/articles/components/ArticleMap.tsx) — isolated, ideal pilot.
- **Three async selectors** total: `apiFeatureQuery`, `rasterAllSourcesQuery`/`rasterSourceDomainsQuery`, and the colormap query. Plus two atomFamilies that Suspense-on-mount via `default: () => new Promise(() => {})` (`paramsConfigState`, `paramsState`).
- **One writable selector with reset-cascade** (`allowedGroupLayersState`) is the only consumer of `isReset()` (from [`src/lib/recoil/is-reset.ts`](../../../src/lib/recoil/is-reset.ts)).
- **Orphans to delete first:** `naturalAssetsSelectionState` ([`src/state/data-selection/natural-assets.ts`](../../../src/state/data-selection/natural-assets.ts)), `hoveredAdaptationFeatureState` ([`src/config/nbs/components/FeatureAdaptationsTable.tsx`](../../../src/config/nbs/components/FeatureAdaptationsTable.tsx)).

## Render the dependency graph

```bash
# from the workspace root
dot -Tsvg .local/_AI_WORKSPACE/cursor/data/state-graph.dot \
  -o .local/_AI_WORKSPACE/cursor/data/state-graph.svg
```

Or render the per-slice diagrams inline in Cursor preview by opening [`03-state-graph.md`](./03-state-graph.md) (mermaid renders natively).

## Out of scope (explicitly not covered)

These were deferred so the analysis stays bounded. Mention them when planning follow-ups.

- **The actual migration code.** Migration is in progress (Slices 2–15b done; Downloads jobs decommissioned 2026-06-02). See [`05-implementation-notes.md`](./05-implementation-notes.md) §6 for current status. This analysis folder was the planning artifact; it is updated incrementally as slices land.
- **Replacing `@recoiljs/refine`.** It's an independent validator library; it works fine inside any Jotai sync layer. Replacing it with `zod`/`valibot` is a separate decision.
- **Comparing to `irv-jamaica`.** The colleague's project was mentioned but the repo/path was not provided here. If you want to feed in that migration's patterns (especially anything around `recoil-sync` → Jotai), point us at the repo and we can produce a delta document next.
- **CI rules to detect new `recoil` imports.** Easy to add (`eslint-plugin-import` `no-restricted-paths` or a custom ESLint rule), but kept out of this snapshot. Once the migration starts, recommend enabling a rule that fails on new `import ... from 'recoil'` outside of `src/lib/recoil/` (and eventually anywhere).

## How to refresh this analysis

The four markdown files and the JSON were assembled from the output of four parallel exploration runs (see chat history). If the codebase changes substantially, you can re-run by asking the agent something like:

1. **"Re-run the recoil inventory."** Dispatches one explore task that re-counts API usage, re-lists every importer of `recoil` / `recoil-sync` / `@recoiljs/refine` / `@/lib/recoil/*`, and refreshes the catalog of `src/lib/recoil/`.
2. **"Re-build the state dependency graph."** Re-walks every atom/selector definition, re-extracts `get`/`set` edges, refreshes `data/state-graph.json` (and re-derives the `.dot` file mechanically).
3. **"Re-evaluate migration slices."** Re-cluster the graph and refresh [`04-migration-slices.md`](./04-migration-slices.md).

In all three cases, edits should land back in this folder under the same filenames.

## Open questions to confirm before migration begins

1. **Target Jotai version.** This analysis assumes **Jotai v2**. Confirm before starting.
2. **URL sync provider.** Pick between (a) writing a small in-repo `atomWithUrlSync` helper or (b) adopting `jotai-location` (community). The slice-7 playbook works either way; the choice mostly affects how much code is in `lib/jotai/`.
3. **Validator library.** Keep `@recoiljs/refine`, or migrate to `zod`/`valibot` in parallel? Default recommendation: keep.
4. **Should each `ArticleMap` keep its own isolated Jotai store** (`<Provider>`), or share the main store with the rest of the app? The current Recoil design is isolated; the §4.2 playbook recommends keeping isolation.
5. **Pre-flight cleanup.** OK to delete `naturalAssetsSelectionState` and `hoveredAdaptationFeatureState` (both unused) in a separate small PR before the migration begins? Recommended.
