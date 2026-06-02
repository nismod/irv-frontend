# 01 — Recoil usage inventory

Snapshot taken: 2026-04-23. Versions pinned in [`package.json`](../../../package.json): `recoil@^0.7.7`, `recoil-sync@^0.2.0`, `@recoiljs/refine@^0.1.1`.

> **Post-snapshot (2026-06-02):** Downloads job pipeline decommissioned — [`jobs.ts`](../../../src/modules/downloads/data/jobs.ts) deleted; `<RecoilLocalStorageSync>` removed from `App.tsx`. `ProcessorVersionListItem` accordion state is inline Jotai. Sections below that reference downloads jobs or `RecoilLocalStorageSync` consumers describe the **historical** snapshot unless noted otherwise. See [`05-implementation-notes.md`](./05-implementation-notes.md) § Downloads decommission.

---

## §1.1 Files importing `recoil`

~117 files. Listed by area; symbols imported per file in braces. Where a file imports `RecoilRoot` or defines atoms/selectors that bridge slices, it is **bolded**.

### App / router shell

- **[`src/App.tsx`](../../../src/App.tsx)** — `{ RecoilRoot }`

### `src/config/`

- [`src/config/nbs/components/FeatureAdaptationsTable.tsx`](../../../src/config/nbs/components/FeatureAdaptationsTable.tsx) — `{ atom, useRecoilState, useRecoilValue, useSetRecoilState }`
- [`src/config/nbs/components/NbsPrioritisationPanel.tsx`](../../../src/config/nbs/components/NbsPrioritisationPanel.tsx) — `{ selector, useRecoilValue }`
- [`src/config/terracotta-color-map.ts`](../../../src/config/terracotta-color-map.ts) — `{ selectorFamily }` _(async)_

### `src/details/`

- [`src/details/DetailsContent.tsx`](../../../src/details/DetailsContent.tsx) — `{ useRecoilValue }`
- [`src/details/pixel-driller/hazard-accordion.tsx`](../../../src/details/pixel-driller/hazard-accordion.tsx) — `{ atom, atomFamily, useRecoilState, useSetRecoilState }`
- [`src/details/pixel-driller/PixelDrillerDetailsPanel.tsx`](../../../src/details/pixel-driller/PixelDrillerDetailsPanel.tsx) — `{ useRecoilValue }`
- [`src/details/pixel-driller/SiteDetailsContent.tsx`](../../../src/details/pixel-driller/SiteDetailsContent.tsx) — `{ useRecoilValue, useSetRecoilState }`
- [`src/details/features/asset-details.tsx`](../../../src/details/features/asset-details.tsx) — `{ RecoilValue, useRecoilValue }`
- [`src/details/features/damages/DamagesSection.tsx`](../../../src/details/features/damages/DamagesSection.tsx) — `{ atom, noWait, selector }`
- [`src/details/features/damages/ExpectedDamagesSection.tsx`](../../../src/details/features/damages/ExpectedDamagesSection.tsx) — `{ selector, useRecoilValue }`
- [`src/details/features/damages/param-controls.tsx`](../../../src/details/features/damages/param-controls.tsx) — `{ selector, useRecoilState, useRecoilValue }`
- [`src/details/features/damages/RPDamagesSection.tsx`](../../../src/details/features/damages/RPDamagesSection.tsx) — `{ selector, useRecoilValue }`
- [`src/details/ui/DeselectButton.tsx`](../../../src/details/ui/DeselectButton.tsx) — `{ useResetRecoilState }`

### `src/lib/`

- [`src/lib/data-map/DataMapTooltip.tsx`](../../../src/lib/data-map/DataMapTooltip.tsx) — `{ useRecoilValue }`
- **[`src/lib/data-map/interactions/interaction-state.ts`](../../../src/lib/data-map/interactions/interaction-state.ts)** — `{ atom, atomFamily, selector }`
- [`src/lib/data-map/interactions/use-interactions.ts`](../../../src/lib/data-map/interactions/use-interactions.ts) — `{ useSetRecoilState }`
- [`src/lib/data-map/legend/use-raster-color-map-values.tsx`](../../../src/lib/data-map/legend/use-raster-color-map-values.tsx) — `{ useRecoilValue }`
- [`src/lib/data-map/state/make-view-layer-params-state.ts`](../../../src/lib/data-map/state/make-view-layer-params-state.ts) — `{ RecoilValueReadOnly, selector, selectorFamily }`
- [`src/lib/data-map/state/make-view-layers-state.ts`](../../../src/lib/data-map/state/make-view-layers-state.ts) — `{ selector }`
- [`src/lib/data-map/tooltip/InteractionGroupTooltip.tsx`](../../../src/lib/data-map/tooltip/InteractionGroupTooltip.tsx) — `{ useRecoilValue }`
- **[`src/lib/data-selection/make-hierarchical-visibility-state.ts`](../../../src/lib/data-selection/make-hierarchical-visibility-state.ts)** — `{ selectorFamily }`
- [`src/lib/data-selection/sidebar/context.ts`](../../../src/lib/data-selection/sidebar/context.ts) — `{ useRecoilState }`
- [`src/lib/data-selection/sidebar/SubSectionToggle.tsx`](../../../src/lib/data-selection/sidebar/SubSectionToggle.tsx) — `{ useRecoilCallback }`
- [`src/lib/map/place-search/MapSearch.tsx`](../../../src/lib/map/place-search/MapSearch.tsx) — `{ useRecoilState }`
- [`src/lib/map/place-search/MapSearchField.tsx`](../../../src/lib/map/place-search/MapSearchField.tsx) — `{ useRecoilState }`
- [`src/lib/map/place-search/search-state.ts`](../../../src/lib/map/place-search/search-state.ts) — `{ atom }`
- [`src/lib/mobile-tabs/TabNavigationAction.tsx`](../../../src/lib/mobile-tabs/TabNavigationAction.tsx) — `{ useRecoilValue }`
- [`src/lib/paths/context.ts`](../../../src/lib/paths/context.ts) — `{ useRecoilValue, useSetRecoilState }`
- [`src/lib/paths/EnforceSingleChild.tsx`](../../../src/lib/paths/EnforceSingleChild.tsx) — `{ useRecoilCallback }`
- [`src/lib/recoil/is-reset.ts`](../../../src/lib/recoil/is-reset.ts) — `{ DefaultValue }`
- [`src/lib/recoil/make-state/make-select-state.ts`](../../../src/lib/recoil/make-state/make-select-state.ts) — `{ atom, RecoilValueReadOnly, selector }`
- [`src/lib/recoil/state-effects/StateEffectRoot.tsx`](../../../src/lib/recoil/state-effects/StateEffectRoot.tsx) — `{ RecoilValueReadOnly }`
- [`src/lib/recoil/state-effects/types.ts`](../../../src/lib/recoil/state-effects/types.ts) — `{ CallbackInterface, TransactionInterface_UNSTABLE }`
- [`src/lib/recoil/state-effects/use-state-effect.ts`](../../../src/lib/recoil/state-effects/use-state-effect.ts) — `{ RecoilValueReadOnly, useRecoilCallback, useRecoilValue }`
- [`src/lib/recoil/state-sync/StateSyncRoot.tsx`](../../../src/lib/recoil/state-sync/StateSyncRoot.tsx) — `{ RecoilState, RecoilValueReadOnly }`
- [`src/lib/recoil/state-sync/use-sync-state-throttled.ts`](../../../src/lib/recoil/state-sync/use-sync-state-throttled.ts) — `{ RecoilState, RecoilValueReadOnly, useRecoilValue, useSetRecoilState }`
- [`src/lib/recoil/state-sync/use-sync-state.ts`](../../../src/lib/recoil/state-sync/use-sync-state.ts) — `{ RecoilState, RecoilValueReadOnly, useRecoilValue, useSetRecoilState }`
- [`src/lib/recoil/sync-stores/RecoilLocalStorageSync.tsx`](../../../src/lib/recoil/sync-stores/RecoilLocalStorageSync.tsx) — `{ DefaultValue }`
- [`src/lib/recoil/types.ts`](../../../src/lib/recoil/types.ts) — `{ ReadOnlySelectorOptions, RecoilState, RecoilValueReadOnly }`
- [`src/lib/recoil/StateWatcher.tsx`](../../../src/lib/recoil/StateWatcher.tsx) — `{ RecoilState, useRecoilValue }`
- [`src/lib/recoil/use-set-recoil-state-family.ts`](../../../src/lib/recoil/use-set-recoil-state-family.ts) — `{ useRecoilCallback }`

### `src/map/`

- [`src/map/layers/layers-state.ts`](../../../src/map/layers/layers-state.ts) — `{ atom }`
- [`src/map/layers/MapLayerSelection.tsx`](../../../src/map/layers/MapLayerSelection.tsx) — `{ useRecoilState }`
- [`src/map/legend/MapLegend.tsx`](../../../src/map/legend/MapLegend.tsx) — `{ useRecoilValue }`
- [`src/map/MapInteractionModeSelector.tsx`](../../../src/map/MapInteractionModeSelector.tsx) — `{ useRecoilState }`
- **[`src/map/MapView.tsx`](../../../src/map/MapView.tsx)** — `{ atom, useRecoilState, useRecoilValue, useResetRecoilState }`
- [`src/map/use-map-fit-bounds.ts`](../../../src/map/use-map-fit-bounds.ts) — `{ useSetRecoilState }`

### `src/modules/`

- **[`src/modules/downloads/data/jobs.ts`](../../../src/modules/downloads/data/jobs.ts)** — `{ atom, selectorFamily, TransactionInterface_UNSTABLE, useRecoilTransaction_UNSTABLE, useRecoilValue }`
- [`src/modules/downloads/sections/datasets/dataset-indicator/DatasetStatusIndicator.tsx`](../../../src/modules/downloads/sections/datasets/dataset-indicator/DatasetStatusIndicator.tsx) — `{ useRecoilValue }`
- [`src/modules/downloads/sections/datasets/ProcessorVersionListItem.tsx`](../../../src/modules/downloads/sections/datasets/ProcessorVersionListItem.tsx) — `{ atomFamily, useRecoilState }`

### `src/pages/`

- **[`src/pages/articles/components/ArticleMap.tsx`](../../../src/pages/articles/components/ArticleMap.tsx)** — `{ RecoilRoot }` _(nested root)_
- [`src/pages/map/layouts/hud.tsx`](../../../src/pages/map/layouts/hud.tsx) — `{ useSetRecoilState }`
- [`src/pages/map/layouts/mobile/tab-has-content.tsx`](../../../src/pages/map/layouts/mobile/tab-has-content.tsx) — `{ atomFamily, useSetRecoilState }`
- [`src/pages/map/MapViewRouteSync.tsx`](../../../src/pages/map/MapViewRouteSync.tsx) — `{ DefaultValue }`

### `src/sidebar/`

- [`src/sidebar/LinkViewLayerToPath.tsx`](../../../src/sidebar/LinkViewLayerToPath.tsx) — `{ RecoilState }`
- **[`src/sidebar/SidebarContent.tsx`](../../../src/sidebar/SidebarContent.tsx)** — `{ atomFamily, useRecoilValue }`
- **[`src/sidebar/url-state.tsx`](../../../src/sidebar/url-state.tsx)** — `{ atom, GetRecoilValue, selector }`
- [`src/sidebar/sections/adaptation/NbsAdaptationSection.tsx`](../../../src/sidebar/sections/adaptation/NbsAdaptationSection.tsx) — `{ useRecoilState, useRecoilValue, useSetRecoilState }`
- [`src/sidebar/sections/buildings/BuildingDensityControl.tsx`](../../../src/sidebar/sections/buildings/BuildingDensityControl.tsx) — `{ useRecoilState }`
- [`src/sidebar/sections/hazards/HazardsControl.tsx`](../../../src/sidebar/sections/hazards/HazardsControl.tsx) — `{ useRecoilValue }`
- [`src/sidebar/sections/industry/IndustryControl.tsx`](../../../src/sidebar/sections/industry/IndustryControl.tsx) — `{ useRecoilState }`
- [`src/sidebar/sections/networks/NetworkControl.tsx`](../../../src/sidebar/sections/networks/NetworkControl.tsx) — `{ useRecoilState }`
- [`src/sidebar/sections/risk/CDDControl.tsx`](../../../src/sidebar/sections/risk/CDDControl.tsx) — `{ useRecoilState }`
- **[`src/sidebar/sections/risk/infrastructure-risk.tsx`](../../../src/sidebar/sections/risk/infrastructure-risk.tsx)** — `{ atom, useRecoilState, useRecoilTransaction_UNSTABLE, useRecoilValue }`
- **[`src/sidebar/sections/risk/population-exposure.tsx`](../../../src/sidebar/sections/risk/population-exposure.tsx)** — `{ atom, TransactionInterface_UNSTABLE, useRecoilState, useRecoilTransaction_UNSTABLE }`
- [`src/sidebar/sections/risk/regional-risk.tsx`](../../../src/sidebar/sections/risk/regional-risk.tsx) — `{ useRecoilState }`
- [`src/sidebar/sections/topography/TopographyControl.tsx`](../../../src/sidebar/sections/topography/TopographyControl.tsx) — `{ useRecoilState }`
- [`src/sidebar/sections/vulnerability/HdiControl.tsx`](../../../src/sidebar/sections/vulnerability/HdiControl.tsx) — `{ useRecoilState }`
- [`src/sidebar/sections/vulnerability/TravelTimeControl.tsx`](../../../src/sidebar/sections/vulnerability/TravelTimeControl.tsx) — `{ useRecoilState }`
- [`src/sidebar/sections/vulnerability/WdpaControl.tsx`](../../../src/sidebar/sections/vulnerability/WdpaControl.tsx) — `{ useRecoilState }`
- [`src/sidebar/ui/DataParam.tsx`](../../../src/sidebar/ui/DataParam.tsx) — `{ useRecoilValue }`

### `src/state/` — simple selection atoms (`{ atom }` only)

- [`src/state/data-selection/building-density.ts`](../../../src/state/data-selection/building-density.ts)
- [`src/state/data-selection/cdd.ts`](../../../src/state/data-selection/cdd.ts)
- [`src/state/data-selection/industry.ts`](../../../src/state/data-selection/industry.ts)
- [`src/state/data-selection/natural-assets.ts`](../../../src/state/data-selection/natural-assets.ts) _(orphan — no consumers)_
- [`src/state/data-selection/protected-areas.ts`](../../../src/state/data-selection/protected-areas.ts)
- [`src/state/data-selection/regional-risk.ts`](../../../src/state/data-selection/regional-risk.ts)
- [`src/state/data-selection/topography.ts`](../../../src/state/data-selection/topography.ts)
- [`src/state/data-selection/travel-time.ts`](../../../src/state/data-selection/travel-time.ts)
- [`src/state/data-selection/human-development.ts`](../../../src/state/data-selection/human-development.ts) — two atoms

### `src/state/` — composite & families

- [`src/state/data-selection/networks/network-selection.ts`](../../../src/state/data-selection/networks/network-selection.ts) — `{ atom, selector, TransactionInterface_UNSTABLE }`
- [`src/state/data-selection/damage-mapping/damage-map.ts`](../../../src/state/data-selection/damage-mapping/damage-map.ts) — `{ atom, selector }`
- [`src/state/data-selection/nbs.ts`](../../../src/state/data-selection/nbs.ts) — `{ atom, selector }` (4 atoms + many selectors)
- **[`src/state/data-selection/hazards.ts`](../../../src/state/data-selection/hazards.ts)** — `{ atomFamily, selector }`
- [`src/state/layers/ui-layers/feature-bbox.ts`](../../../src/state/layers/ui-layers/feature-bbox.ts) — `{ atom, selector }`
- [`src/state/map-view/map-interaction-state.ts`](../../../src/state/map-view/map-interaction-state.ts) — `{ atom }`
- **[`src/state/map-view/map-url.ts`](../../../src/state/map-view/map-url.ts)** — `{ atom, DefaultValue }`
- [`src/state/map-view/pixel-driller-url-state.ts`](../../../src/state/map-view/pixel-driller-url-state.ts) — `{ atom, DefaultValue }`
- **[`src/state/map-view/map-view-state.ts`](../../../src/state/map-view/map-view-state.ts)** — `{ atom, DefaultValue, selector }`
- **[`src/state/view.ts`](../../../src/state/view.ts)** — `{ atom }`

### `src/state/` — `{ selector }` only (per-layer compositors)

- [`src/state/data-selection/damage-mapping/damage-style-params.ts`](../../../src/state/data-selection/damage-mapping/damage-style-params.ts)
- [`src/state/data-selection/networks/networks-style.ts`](../../../src/state/data-selection/networks/networks-style.ts)
- [`src/state/layers/interaction-groups.ts`](../../../src/state/layers/interaction-groups.ts)
- All 19 files in [`src/state/layers/data-layers/`](../../../src/state/layers/data-layers/): `building-density.ts`, `cdd.ts`, `hazards.ts`, `healthcare.ts`, `hdi-grid.ts`, `human-development.ts`, `industry.ts`, `land-cover.ts`, `nature-vulnerability.ts`, `nbs.ts`, `networks.ts`, `organic-carbon.ts`, `population-exposure.ts`, `population.ts`, `protected-areas.ts`, `regional-risk.ts`, `rwi.ts`, `topography.ts`, `travel-time.ts`

### `src/state/` — queries, params, view-layer assembly

- **[`src/state/queries.ts`](../../../src/state/queries.ts)** — `{ selectorFamily }` _(async)_
- **[`src/state/data-domains/sources.ts`](../../../src/state/data-domains/sources.ts)** — `{ selector, selectorFamily }` _(async)_
- [`src/state/data-domains/hazards.ts`](../../../src/state/data-domains/hazards.ts) — `{ selectorFamily }`
- **[`src/state/data-params.ts`](../../../src/state/data-params.ts)** — `{ atomFamily, RecoilValue, selectorFamily, useRecoilTransaction_UNSTABLE, useRecoilValue, useRecoilValueLoadable, useSetRecoilState }`
- [`src/state/layers/view-layers-params.ts`](../../../src/state/layers/view-layers-params.ts) — `{ GetRecoilValue }`
- **[`src/state/layers/view-layers.ts`](../../../src/state/layers/view-layers.ts)** — `{ waitForAll }`

---

## §1.2 Files importing `recoil-sync` and `@recoiljs/refine`

### `recoil-sync` (8 files)

| File                                                                                                                      | Symbols                                  |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [`src/App.tsx`](../../../src/App.tsx)                                                                                     | `RecoilURLSyncJSON`                      |
| [`src/lib/recoil/sync-stores/RecoilLocalStorageSync.tsx`](../../../src/lib/recoil/sync-stores/RecoilLocalStorageSync.tsx) | `RecoilSync`, `RecoilSyncOptions` (type) |
| [`src/modules/downloads/data/jobs.ts`](../../../src/modules/downloads/data/jobs.ts)                                       | `syncEffect`                             |
| [`src/pages/map/MapViewRouteSync.tsx`](../../../src/pages/map/MapViewRouteSync.tsx)                                       | `RecoilSync`                             |
| [`src/sidebar/url-state.tsx`](../../../src/sidebar/url-state.tsx)                                                         | `syncEffect`, `urlSyncEffect`            |
| [`src/state/map-view/map-url.ts`](../../../src/state/map-view/map-url.ts)                                                 | `urlSyncEffect`, `WriteAtom`             |
| [`src/state/map-view/pixel-driller-url-state.ts`](../../../src/state/map-view/pixel-driller-url-state.ts)                 | `urlSyncEffect`, `WriteAtom`             |
| [`src/state/view.ts`](../../../src/state/view.ts)                                                                         | `syncEffect`                             |

`useRecoilSync` is not used anywhere in `src/`.

### `@recoiljs/refine` (5 files)

| File                                                                                                      | Symbols                             |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [`src/modules/downloads/data/jobs.ts`](../../../src/modules/downloads/data/jobs.ts)                       | `array`, `date`, `object`, `string` |
| [`src/sidebar/url-state.tsx`](../../../src/sidebar/url-state.tsx)                                         | `bool`, `dict`, `lazy`, `union`     |
| [`src/state/map-view/map-url.ts`](../../../src/state/map-view/map-url.ts)                                 | `number`                            |
| [`src/state/map-view/pixel-driller-url-state.ts`](../../../src/state/map-view/pixel-driller-url-state.ts) | `string`                            |
| [`src/state/view.ts`](../../../src/state/view.ts)                                                         | `string`                            |

---

## §1.3 API usage counts

### State definitions

| API                          | Approx. call sites | Notes                                                                                                              |
| ---------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `atom(`                      | 43                 | matches `= atom(`                                                                                                  |
| `atomFamily(`                | 12                 | matches `= atomFamily(`                                                                                            |
| `selector(`                  | 62                 | matches `= selector(`                                                                                              |
| `selectorFamily(`            | 13                 | matches `= selectorFamily(`                                                                                        |
| `waitForAll(`                | 1                  | only [`src/state/layers/view-layers.ts`](../../../src/state/layers/view-layers.ts)                                 |
| `noWait(`                    | 1                  | only [`src/details/features/damages/DamagesSection.tsx`](../../../src/details/features/damages/DamagesSection.tsx) |
| `constSelector`              | 0                  | unused                                                                                                             |
| `errorSelector`              | 0                  | unused                                                                                                             |
| `waitForAny` / `waitForNone` | 0                  | unused                                                                                                             |
| `dangerouslyAllowMutability` | 1                  | `mapViewStateState` in [`src/state/map-view/map-view-state.ts`](../../../src/state/map-view/map-view-state.ts)     |

### Hooks

| Hook                            | Count |
| ------------------------------- | ----- |
| `useRecoilState`                | 38    |
| `useRecoilValue`                | 52    |
| `useSetRecoilState`             | 16    |
| `useResetRecoilState`           | 2     |
| `useRecoilValueLoadable`        | 1     |
| `useRecoilStateLoadable`        | 0     |
| `useRecoilCallback`             | 5     |
| `useRecoilTransaction_UNSTABLE` | 6     |
| `useRecoilSnapshot`             | 0     |
| `useGotoRecoilSnapshot`         | 0     |
| `useRecoilRefresher_UNSTABLE`   | 0     |
| `useRecoilStoreID`              | 0     |

### Components

| API            | Where                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RecoilRoot`   | [`src/App.tsx`](../../../src/App.tsx) (main), [`src/pages/articles/components/ArticleMap.tsx`](../../../src/pages/articles/components/ArticleMap.tsx) (nested per-embed) |
| `RecoilBridge` | not used                                                                                                                                                                 |

### Sync (`recoil-sync`)

| API                           | Used in                                                                                                                                                                                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RecoilURLSyncJSON`           | [`src/App.tsx`](../../../src/App.tsx) — `storeKey="url-json"`, `location={{ part: 'queryParams' }}`                                                                                                                                                              |
| `RecoilSync`                  | [`src/pages/map/MapViewRouteSync.tsx`](../../../src/pages/map/MapViewRouteSync.tsx) (`storeKey="map-view-route"`), [`src/lib/recoil/sync-stores/RecoilLocalStorageSync.tsx`](../../../src/lib/recoil/sync-stores/RecoilLocalStorageSync.tsx) (read/write/listen) |
| `syncEffect`                  | [`src/sidebar/url-state.tsx`](../../../src/sidebar/url-state.tsx), [`src/state/view.ts`](../../../src/state/view.ts), [`src/modules/downloads/data/jobs.ts`](../../../src/modules/downloads/data/jobs.ts)                                                        |
| `urlSyncEffect`               | [`src/state/map-view/map-url.ts`](../../../src/state/map-view/map-url.ts), [`src/state/map-view/pixel-driller-url-state.ts`](../../../src/state/map-view/pixel-driller-url-state.ts), [`src/sidebar/url-state.tsx`](../../../src/sidebar/url-state.tsx)          |
| `WriteAtom` (type + callback) | [`src/state/map-view/map-url.ts`](../../../src/state/map-view/map-url.ts), [`src/state/map-view/pixel-driller-url-state.ts`](../../../src/state/map-view/pixel-driller-url-state.ts)                                                                             |

### Refine (`@recoiljs/refine`)

Used only in the five files listed in §1.2; symbols: `bool`, `dict`, `lazy`, `union`, `number`, `string` (×3 files), `array`, `date`, `object`.

### Types/utilities imported from `recoil`

`DefaultValue`, `GetRecoilValue`, `RecoilState`, `RecoilValue`, `RecoilValueReadOnly`, `ReadOnlySelectorOptions`, `CallbackInterface`, `TransactionInterface_UNSTABLE` — used for typings, reset handling, and transaction callback signatures. See §1.6 for how they flow into the [`src/lib/recoil/`](../../../src/lib/recoil/) helpers.

---

## §1.4 All atoms / selectors / families defined in `src/`

Grouped by directory. `JS export` and Recoil `key` are sometimes different; both are given where they differ.

### `src/config/`

| File                                                | Export                             | Kind           | Recoil key                       | Param type                                    | Notes                                                                                                                |
| --------------------------------------------------- | ---------------------------------- | -------------- | -------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `config/terracotta-color-map.ts`                    | _(internal)_ `colorMapValuesQuery` | selectorFamily | `colorMapValuesQuery`            | `string`                                      | **async** API call                                                                                                   |
| `config/terracotta-color-map.ts`                    | `terracottaColorMapValuesQuery`    | selectorFamily | `terracottaColorMapValuesQuery`  | `{ scheme: string; range: [number, number] }` | reads `colorMapValuesQuery`                                                                                          |
| `config/nbs/components/NbsPrioritisationPanel.tsx`  | `showPrioritisationState`          | selector       | `showPrioritisationState`        | —                                             | reads `sidebarPathVisibilityState('adaptation/nbs')`, `nbsSelectedScopeRegionIdState`, `nbsIsDataVariableContinuous` |
| `config/nbs/components/FeatureAdaptationsTable.tsx` | `hoveredAdaptationFeatureState`    | atom           | `hoveredAdaptationFeatureState`  | —                                             | **orphan — no consumers**                                                                                            |
| `config/nbs/components/FeatureAdaptationsTable.tsx` | `selectedAdaptationFeatureState`   | atom           | `selectedAdaptationFeatureState` | —                                             |                                                                                                                      |

### `src/details/`

| File                                                  | Export                                                                        | Kind                             | Recoil key                                                                                     | Param type |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| `details/pixel-driller/hazard-accordion.tsx`          | `hazardAccordionExpandedState`                                                | atomFamily                       | `hazardAccordionExpandedState`                                                                 | `string`   |
| `details/pixel-driller/hazard-accordion.tsx`          | `openAccordionState`                                                          | atom                             | `openAccordionState`                                                                           | —          |
| `details/pixel-driller/hazard-accordion.tsx`          | `accordionTransitionCountState`                                               | atom                             | `accordionTransitionCountState`                                                                | —          |
| `details/features/damages/DamagesSection.tsx`         | `featureState`                                                                | atom                             | `DamagesSection/featureState`                                                                  | —          |
| `details/features/damages/DamagesSection.tsx`         | `hazardDataParamsState`                                                       | selector                         | `DamagesSection/hazardDataParams`                                                              | —          |
| `details/features/damages/ExpectedDamagesSection.tsx` | _(internal)_ `damagesOrderingState`                                           | selector                         | `DamagesSection/damagesOrderingState`                                                          | —          |
| `details/features/damages/ExpectedDamagesSection.tsx` | `damagesDataState`                                                            | selector                         | `DamagesSection/damagesDataState`                                                              | —          |
| `details/features/damages/ExpectedDamagesSection.tsx` | _(internal)_ `selectedDamagesDataState`                                       | selector                         | `DamagesSection/selectedDamagesData`                                                           | —          |
| `details/features/damages/param-controls.tsx`         | `hazardsState`, `epochsState`, `rpOptionsState` (internal)                    | selector                         | `DamagesSection/hazardsState` etc.                                                             | —          |
| `details/features/damages/param-controls.tsx`         | `selectedHazardState`, `selectedEpochState`, `selectedRpOptionState`          | selector (via `makeSelectState`) | `DamagesSection/selectedHazard`(+`/impl`,`/default`) etc.                                      | —          |
| `details/features/damages/RPDamagesSection.tsx`       | _(internal)_ `rpOrderingState`, `rpDamageDataState`, `filteredTableDataState` | selector                         | `rpOrderingState`, `DamagesSection/rpDamageDataState`, `DamagesSection/filteredTableDataState` | —          |
| `details/features/damages/RPDamagesSection.tsx`       | `selectedRpDataState`                                                         | selector                         | `DamagesSection/selectedRpDataState`                                                           | —          |

### `src/lib/data-map/`

| File                                                                   | Export                                                                         | Kind                                   | Recoil key                                                                                      | Param type                |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------- |
| `lib/data-map/interactions/interaction-state.ts`                       | `hoverState`                                                                   | atomFamily                             | `hoverState`                                                                                    | `string` (group)          |
| `lib/data-map/interactions/interaction-state.ts`                       | `hoverPositionState`                                                           | atom                                   | `hoverPosition`                                                                                 | —                         |
| `lib/data-map/interactions/interaction-state.ts`                       | `selectionState`                                                               | atomFamily                             | `selectionState`                                                                                | `string` (group)          |
| `lib/data-map/interactions/interaction-state.ts`                       | _(internal)_ `allowedGroupLayersInternal`                                      | atom                                   | `allowedGroupLayersInternal`                                                                    | —                         |
| `lib/data-map/interactions/interaction-state.ts`                       | `allowedGroupLayersState`                                                      | selector (RW)                          | `allowedGroupLayersState`                                                                       | —                         |
| _(factory)_ `lib/data-map/state/make-view-layers-state.ts`             | returns `viewLayersState` (used by `state/layers/view-layers.ts`)              | selector                               | `<key>/viewLayersNestedState`, `<key>/viewLayersFlatState`                                      | —                         |
| _(factory)_ `lib/data-map/state/make-view-layer-params-state.ts`       | returns `viewLayersParamsState` (used by `state/layers/view-layers-params.ts`) | selector + 2 internal selectorFamilies | `<key>/singleViewLayerState`, `<key>/singleViewLayerParamsState`, `<key>/viewLayersParamsState` | `string` for the families |
| _(factory)_ `lib/data-selection/make-hierarchical-visibility-state.ts` | returns `sidebarPathVisibilityState`                                           | selectorFamily                         | `sidebarPathVisibilityState`                                                                    | `string` (path)           |
| _(factory)_ `lib/recoil/make-state/make-select-state.ts`               | returns a writable selector                                                    | selector                               | `${key}`, `${key}/impl`, `${key}/default`                                                       | —                         |
| `lib/map/place-search/search-state.ts`                                 | `placeSearchActiveState`                                                       | atom                                   | `placeSearchActive`                                                                             | —                         |
| `lib/map/place-search/search-state.ts`                                 | `placeSearchQueryState`                                                        | atom                                   | `placeSearchQuery`                                                                              | —                         |

### `src/map/`

| File                         | Export              | Kind | Recoil key          |
| ---------------------------- | ------------------- | ---- | ------------------- |
| `map/layers/layers-state.ts` | `backgroundState`   | atom | `background`        |
| `map/layers/layers-state.ts` | `showLabelsState`   | atom | `showLabels`        |
| `map/MapView.tsx`            | `mapFitBoundsState` | atom | `mapFitBoundsState` |

### `src/modules/downloads/`

| File                                                               | Export                                           | Kind                             | Recoil key                 | Notes                                 |
| ------------------------------------------------------------------ | ------------------------------------------------ | -------------------------------- | -------------------------- | ------------------------------------- |
| `modules/downloads/data/jobs.ts`                                   | `submittedJobsState`                             | atom                             | `submittedJobs`            | `syncEffect` → local-storage          |
| `modules/downloads/data/jobs.ts`                                   | `completedJobsState`                             | atom                             | `completedJobs`            | `syncEffect` → local-storage          |
| `modules/downloads/data/jobs.ts`                                   | `lastSubmittedJobByParamsState`                  | selectorFamily                   | `lastSubmittedJobByParams` | `{ boundaryName, processorVersion }`  |
| `modules/downloads/data/jobs.ts`                                   | _(local helper)_ `moveJobToCompletedTransaction` | transaction fn (not Recoil atom) | —                          | wired through `useMoveJobToCompleted` |
| `modules/downloads/sections/datasets/ProcessorVersionListItem.tsx` | _(local)_ `expandedDatasetByRegionState`         | atomFamily                       | `expandedDatasetByRegion`  | `string` (boundary)                   |

### `src/pages/`

| File                                           | Export                     | Kind       | Recoil key                 | Param type        |
| ---------------------------------------------- | -------------------------- | ---------- | -------------------------- | ----------------- |
| `pages/map/layouts/mobile/tab-has-content.tsx` | `mobileTabHasContentState` | atomFamily | `mobileTabHasContentState` | `string` (tab id) |

### `src/sidebar/`

| File                                            | Export                                     | Kind                     | Recoil key                        | Param type      | Notes                                                                              |
| ----------------------------------------------- | ------------------------------------------ | ------------------------ | --------------------------------- | --------------- | ---------------------------------------------------------------------------------- |
| `sidebar/SidebarContent.tsx`                    | `sidebarVisibilityToggleState`             | atomFamily               | `sidebarVisibilityToggleState`    | `string` (path) | `effects: defaultSectionVisibilitySyncEffect(path)` — URL-synced via `recoil-sync` |
| `sidebar/SidebarContent.tsx`                    | `sidebarExpandedState`                     | atomFamily               | `sidebarExpandedState`            | `string` (path) | **default points at `sidebarVisibilityToggleState`** (Recoil-only pattern)         |
| `sidebar/SidebarContent.tsx`                    | `sidebarPathChildrenState`                 | atomFamily               | `sidebarPathChildrenState`        | `string`        |                                                                                    |
| `sidebar/SidebarContent.tsx`                    | `sidebarPathChildrenLoadingState`          | atomFamily               | `sidebarPathChildrenLoadingState` | `string`        |                                                                                    |
| `sidebar/SidebarContent.tsx`                    | `sidebarPathVisibilityState`               | selectorFamily (factory) | `sidebarPathVisibilityState`      | `string` (path) | **hub node** — recursive read/write through visibility tree                        |
| `sidebar/url-state.tsx`                         | _(local)_ `sidebarSectionsUrlOutwardState` | selector                 | `sidebarSectionsUrlOutward`       | —               | derived tree from visibility + children                                            |
| `sidebar/url-state.tsx`                         | `sidebarSectionsUrlParamsState`            | atom                     | `sidebarSectionsUrlParams`        | —               | `urlSyncEffect` → `sections` query param                                           |
| `sidebar/sections/risk/infrastructure-risk.tsx` | _(local)_ `infrastructureRiskConfig`       | atom                     | `infrastructureRiskConfig`        | —               | fed to `useLoadParamsConfig` for the `'infrastructure-risk'` param group           |
| `sidebar/sections/risk/population-exposure.tsx` | `populationExposureHazardState`            | atom                     | `populationExposureHazardState`   | —               |                                                                                    |

### `src/state/`

| File                                                         | Export                                                                                                                                                                                                                                                                                                                                                      | Kind                         | Recoil key                                                                     | Param type         | Sync                                                                            |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------- |
| `state/view.ts`                                              | `viewState`                                                                                                                                                                                                                                                                                                                                                 | atom (`ViewType`)            | `viewState`                                                                    | —                  | `syncEffect` → `map-view-route` store                                           |
| `state/queries.ts`                                           | `apiFeatureQuery`                                                                                                                                                                                                                                                                                                                                           | selectorFamily               | `apiFeatureQuery`                                                              | `number`           | **async**                                                                       |
| `state/data-domains/sources.ts`                              | `rasterAllSourcesQuery`                                                                                                                                                                                                                                                                                                                                     | selector                     | `rasterAllSourcesQuery`                                                        | —                  | **async**                                                                       |
| `state/data-domains/sources.ts`                              | `rasterSourceByDomainQuery`                                                                                                                                                                                                                                                                                                                                 | selectorFamily               | `rasterSourceByDomainQuery`                                                    | `string`           | sync                                                                            |
| `state/data-domains/sources.ts`                              | `rasterSourceDomainsQuery`                                                                                                                                                                                                                                                                                                                                  | selectorFamily               | `rasterSourceDomainsQuery`                                                     | `string`           | **async**                                                                       |
| `state/data-domains/hazards.ts`                              | `hazardDomainsConfigState`                                                                                                                                                                                                                                                                                                                                  | selectorFamily               | `hazardDomainsConfigState`                                                     | `HazardType`       |                                                                                 |
| `state/data-params.ts`                                       | `paramsConfigState`                                                                                                                                                                                                                                                                                                                                         | atomFamily                   | `paramsConfigState`                                                            | `string` (group)   | default = `new Promise(() => {})` (Suspend until hydrated)                      |
| `state/data-params.ts`                                       | `paramsState`                                                                                                                                                                                                                                                                                                                                               | atomFamily                   | `paramsState`                                                                  | `string` (group)   | default = `new Promise(() => {})`                                               |
| `state/data-params.ts`                                       | `paramValueState`                                                                                                                                                                                                                                                                                                                                           | selectorFamily               | `paramValueState`                                                              | `{ group, param }` |                                                                                 |
| `state/data-params.ts`                                       | `paramOptionsState`                                                                                                                                                                                                                                                                                                                                         | selectorFamily               | `paramOptionsState`                                                            | `{ group, param }` |                                                                                 |
| `state/data-params.ts`                                       | `dataParamsByGroupState`                                                                                                                                                                                                                                                                                                                                    | selectorFamily               | `dataParamsByGroupState`                                                       | `string` (group)   |                                                                                 |
| `state/data-selection/hazards.ts`                            | `hazardSelectionState`                                                                                                                                                                                                                                                                                                                                      | atomFamily                   | `hazardSelectionState`                                                         | `string` (hazard)  |                                                                                 |
| `state/data-selection/hazards.ts`                            | `hazardVisibilityState`                                                                                                                                                                                                                                                                                                                                     | selector                     | `hazardVisibilityState`                                                        | —                  |                                                                                 |
| `state/data-selection/damage-mapping/damage-map.ts`          | `showInfrastructureRiskState`                                                                                                                                                                                                                                                                                                                               | atom                         | `infrastructureRiskShownState`                                                 | —                  |                                                                                 |
| `state/data-selection/damage-mapping/damage-map.ts`          | `showInfrastructureDamagesState`                                                                                                                                                                                                                                                                                                                            | selector                     | `showInfrastructureDamagesState`                                               | —                  |                                                                                 |
| `state/data-selection/damage-mapping/damage-map.ts`          | `damageSourceState`                                                                                                                                                                                                                                                                                                                                         | atom                         | `damageSourceState`                                                            | —                  |                                                                                 |
| `state/data-selection/damage-mapping/damage-map.ts`          | `damageTypeState`                                                                                                                                                                                                                                                                                                                                           | atom                         | `damageTypeState`                                                              | —                  |                                                                                 |
| `state/data-selection/damage-mapping/damage-style-params.ts` | `damagesFieldState`                                                                                                                                                                                                                                                                                                                                         | selector                     | `eadAccessorState`                                                             | —                  |                                                                                 |
| `state/data-selection/damage-mapping/damage-style-params.ts` | `damageMapStyleParamsState`                                                                                                                                                                                                                                                                                                                                 | selector                     | `damageMapStyleParamsState`                                                    | —                  |                                                                                 |
| `state/data-selection/networks/network-selection.ts`         | `networkTreeExpandedState`                                                                                                                                                                                                                                                                                                                                  | atom                         | `networkTreeExpandedState`                                                     | —                  |                                                                                 |
| `state/data-selection/networks/network-selection.ts`         | `networkTreeCheckboxState`                                                                                                                                                                                                                                                                                                                                  | atom                         | `networkTreeSelectionState`                                                    | —                  |                                                                                 |
| `state/data-selection/networks/network-selection.ts`         | `networkSelectionState`                                                                                                                                                                                                                                                                                                                                     | selector                     | `networkSelectionState`                                                        | —                  |                                                                                 |
| `state/data-selection/networks/networks-style.ts`            | `networksStyleState`                                                                                                                                                                                                                                                                                                                                        | selector                     | `networksStyleState`                                                           | —                  |                                                                                 |
| `state/data-selection/nbs.ts`                                | `nbsAdaptationTypeState`, `nbsRegionScopeLevelState`, `nbsAdaptationHazardState`, `nbsVariableState`                                                                                                                                                                                                                                                        | atom × 4                     | same                                                                           | —                  |                                                                                 |
| `state/data-selection/nbs.ts`                                | `nbsRegionScopeLevelIdPropertyState`, `nbsSelectedScopeRegionState`, `nbsSelectedScopeRegionBboxState`, `nbsSelectedScopeRegionIdState`, `nbsSelectedScopeRegionNameState`, `nbsAdaptationScopeSpecState`, `nbsIsDataVariableContinuous`, `nbsLayerSpecState`, `nbsFieldSpecState`, `nbsColorSpecState`, `nbsStyleParamsState`, `nbsCategoricalConfigState` | selector × 12                | same                                                                           | —                  |                                                                                 |
| `state/data-selection/nbs.ts`                                | _(local)_ `nbsPrimaryCategoricalVariableState`                                                                                                                                                                                                                                                                                                              | selector                     | `nbsPrimaryCategoricalVariableState`                                           | —                  |                                                                                 |
| `state/data-selection/building-density.ts`                   | `buildingDensityTypeState`                                                                                                                                                                                                                                                                                                                                  | atom                         | `buildingDensityTypeState`                                                     | —                  |                                                                                 |
| `state/data-selection/cdd.ts`                                | `cddSelectionState`                                                                                                                                                                                                                                                                                                                                         | atom                         | `cddSelectionState`                                                            | —                  |                                                                                 |
| `state/data-selection/human-development.ts`                  | `hdiVariableState`, `hdiRegionLevelState`                                                                                                                                                                                                                                                                                                                   | atom × 2                     | same                                                                           | —                  |                                                                                 |
| `state/data-selection/industry.ts`                           | `industrySelectionState`                                                                                                                                                                                                                                                                                                                                    | atom                         | `industrySelectionState`                                                       | —                  |                                                                                 |
| `state/data-selection/natural-assets.ts`                     | `naturalAssetsSelectionState`                                                                                                                                                                                                                                                                                                                               | atom                         | `naturalAssetsSelectionState`                                                  | —                  | **orphan**                                                                      |
| `state/data-selection/protected-areas.ts`                    | `protectedAreaTypeSelectionState`                                                                                                                                                                                                                                                                                                                           | atom                         | `protectedAreaTypeSelectionState`                                              | —                  |                                                                                 |
| `state/data-selection/regional-risk.ts`                      | `regionalExposureVariableState`                                                                                                                                                                                                                                                                                                                             | atom                         | `regionalExposureVariableState`                                                | —                  |                                                                                 |
| `state/data-selection/topography.ts`                         | `topographySelectionState`                                                                                                                                                                                                                                                                                                                                  | atom                         | `topographySelectionState`                                                     | —                  |                                                                                 |
| `state/data-selection/travel-time.ts`                        | `travelTimeTypeState`                                                                                                                                                                                                                                                                                                                                       | atom                         | `travelTimeTypeState`                                                          | —                  |                                                                                 |
| `state/map-view/map-interaction-state.ts`                    | `mapInteractionModeState`                                                                                                                                                                                                                                                                                                                                   | atom                         | `mapInteractionMode`                                                           | —                  |                                                                                 |
| `state/map-view/map-interaction-state.ts`                    | `pixelDrillerClickLocationState`                                                                                                                                                                                                                                                                                                                            | atom                         | `pixelDrillerClickLocation`                                                    | —                  |                                                                                 |
| `state/map-view/map-url.ts`                                  | `mapZoomUrlState`, `mapLonUrlState`, `mapLatUrlState`                                                                                                                                                                                                                                                                                                       | atom × 3                     | `mapZoomUrl`, `mapLonUrl`, `mapLatUrl`                                         | —                  | `urlSyncEffect` → `z`, `x`, `y`                                                 |
| `state/map-view/pixel-driller-url-state.ts`                  | `pixelDrillerSiteUrlState`                                                                                                                                                                                                                                                                                                                                  | atom                         | `pixelDrillerSiteUrl`                                                          | —                  | `urlSyncEffect` → `site`                                                        |
| `state/map-view/map-view-state.ts`                           | _(internal)_ `mapLatState`, `mapLonState`, `mapZoomState`                                                                                                                                                                                                                                                                                                   | atom × 3                     | `mapLat`, `mapLon`, `mapZoom`                                                  | —                  | default = corresponding URL atom                                                |
| `state/map-view/map-view-state.ts`                           | `nonCoordsMapViewStateState`                                                                                                                                                                                                                                                                                                                                | atom                         | `nonCoordsMapViewState`                                                        | —                  |                                                                                 |
| `state/map-view/map-view-state.ts`                           | `mapViewStateState`                                                                                                                                                                                                                                                                                                                                         | selector (RW)                | `mapViewState`                                                                 | —                  | **uses `dangerouslyAllowMutability`**                                           |
| `state/layers/interaction-groups.ts`                         | `interactionGroupsState`                                                                                                                                                                                                                                                                                                                                    | selector                     | `interactionGroupsState`                                                       | —                  | static config                                                                   |
| `state/layers/view-layers.ts`                                | `viewLayersState` (built via `makeViewLayersState`)                                                                                                                                                                                                                                                                                                         | selector                     | `viewLayersState/viewLayersNestedState`, `viewLayersState/viewLayersFlatState` | —                  | **hub: `waitForAll` over ~22 layer selectors**                                  |
| `state/layers/view-layers-params.ts`                         | `viewLayersParamsState` (built via `makeViewLayerParamsState`)                                                                                                                                                                                                                                                                                              | selector + internal families | `viewLayersParamsState/...`                                                    | —                  | reads `selectionState` per layer                                                |
| `state/layers/ui-layers/feature-bbox.ts`                     | `boundedFeatureState`                                                                                                                                                                                                                                                                                                                                       | atom                         | `boundedFeatureBboxState`                                                      | —                  |                                                                                 |
| `state/layers/ui-layers/feature-bbox.ts`                     | `featureBoundingBoxLayerState`                                                                                                                                                                                                                                                                                                                              | selector                     | `featureBoundingBoxLayerState`                                                 | —                  |                                                                                 |
| `state/layers/data-layers/*.ts`                              | one `*LayerState` selector per file (19 files)                                                                                                                                                                                                                                                                                                              | selector × 19                | `<name>LayerState` (or pluralised)                                             | —                  | all read `sidebarPathVisibilityState('<path>')` and optionally a selection atom |

---

## §1.5 `RecoilRoot` and sync wrapper nesting

**Main app tree** ([`src/App.tsx`](../../../src/App.tsx)):

```22:37:src/App.tsx
    <RecoilRoot>
      <RecoilLocalStorageSync storeKey="local-storage">
        <RecoilURLSyncJSON storeKey="url-json" location={{ part: 'queryParams' }}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <QueryClientProvider client={queryClient}>
                <RasterColorMapSourceProvider state={terracottaColorMapValuesQuery}>
                  <RouterProvider router={router} />
                </RasterColorMapSourceProvider>
              </QueryClientProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </RecoilURLSyncJSON>
      </RecoilLocalStorageSync>
    </RecoilRoot>
```

Nesting summary:

| Layer | Component                                                              | Source of state                                                                                                                                                                          |
| ----- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | `RecoilRoot`                                                           | the Recoil store everything else reads from                                                                                                                                              |
| 2     | `RecoilLocalStorageSync` (storeKey `"local-storage"`)                  | wraps `recoil-sync`'s `RecoilSync` with read/write/listen against `window.localStorage` (see `src/lib/recoil/sync-stores/RecoilLocalStorageSync.tsx`)                                    |
| 3     | `RecoilURLSyncJSON` (storeKey `"url-json"`, `queryParams`)             | JSON-encoded URL query string sync from `recoil-sync`                                                                                                                                    |
| 4     | MUI providers (`StyledEngineProvider`, `ThemeProvider`, `CssBaseline`) | non-Recoil                                                                                                                                                                               |
| 5     | `QueryClientProvider`                                                  | TanStack Query, independent                                                                                                                                                              |
| 6     | `RasterColorMapSourceProvider`                                         | React context that wraps a Recoil selector family (`terracottaColorMapValuesQuery`) and exposes it through `useRecoilValue` inside `lib/data-map/legend/use-raster-color-map-values.tsx` |
| 7     | `RouterProvider`                                                       | react-router                                                                                                                                                                             |

**Route-scoped `RecoilSync`** ([`src/pages/map/MapViewRouteSync.tsx`](../../../src/pages/map/MapViewRouteSync.tsx)) wraps the `/view/:view` subtree:

```14:33:src/pages/map/MapViewRouteSync.tsx
    <RecoilSync
      storeKey="map-view-route"
      read={(itemKey) => {
        if (itemKey === 'view') {
          return view;
        } else return new DefaultValue();
      }}
      listen={({ updateItem }) => {
        updateItemRef.current = updateItem;

        return () => {
          updateItemRef.current = null;
        };
      }}
    >
      {children}
    </RecoilSync>
```

This couples the `:view` route param to the `viewState` atom (`syncEffect` with `storeKey: 'map-view-route'`).

**Nested `RecoilRoot`** ([`src/pages/articles/components/ArticleMap.tsx`](../../../src/pages/articles/components/ArticleMap.tsx)) — each `ArticleMap` instance opens its own Recoil store so that map interaction state (hover, selection, hover position) does not bleed into the main app. There are no sync wrappers here.

---

## §1.6 Catalog of `src/lib/recoil/`

Twelve files. For each: exports, signatures (paraphrased to the surface API), behavior notes, Recoil dependencies, and consumers.

### `lib/recoil/types.ts`

```1:16:src/lib/recoil/types.ts
import { ReadOnlySelectorOptions, RecoilState, RecoilValueReadOnly } from 'recoil';

/**
 * A readable and writable recoil state family
 */
export type RecoilStateFamily<DataType, ParamType> = (param: ParamType) => RecoilState<DataType>;

/**
 * A recoil state family for which only read operation is required
 */
export type RecoilReadableStateFamily<DataType, ParamType> = (
  param: ParamType,
) => RecoilState<DataType> | RecoilValueReadOnly<DataType>;

/** Type for Recoil read-only selector `get` definition */
export type ReadSelectorGetDefinition<T> = ReadOnlySelectorOptions<T>['get'];
```

**Exports**

| Name                                             | Kind | Signature                                                                      |
| ------------------------------------------------ | ---- | ------------------------------------------------------------------------------ |
| `RecoilStateFamily<DataType, ParamType>`         | type | `(param: ParamType) => RecoilState<DataType>`                                  |
| `RecoilReadableStateFamily<DataType, ParamType>` | type | `(param: ParamType) => RecoilState<DataType> \| RecoilValueReadOnly<DataType>` |
| `ReadSelectorGetDefinition<T>`                   | type | `ReadOnlySelectorOptions<T>['get']`                                            |

**Consumers**

- `RecoilStateFamily` — [`src/state/data-selection/hazards.ts`](../../../src/state/data-selection/hazards.ts), [`src/sidebar/SidebarContent.tsx`](../../../src/sidebar/SidebarContent.tsx), [`src/lib/data-selection/sidebar/root.tsx`](../../../src/lib/data-selection/sidebar/root.tsx), [`src/lib/paths/EnforceSingleChild.tsx`](../../../src/lib/paths/EnforceSingleChild.tsx), [`src/lib/data-selection/sidebar/context.ts`](../../../src/lib/data-selection/sidebar/context.ts), [`src/lib/data-selection/sidebar/SubSectionToggle.tsx`](../../../src/lib/data-selection/sidebar/SubSectionToggle.tsx), [`src/lib/paths/PathRoot.tsx`](../../../src/lib/paths/PathRoot.tsx), [`src/lib/paths/context.ts`](../../../src/lib/paths/context.ts), [`src/lib/data-selection/make-hierarchical-visibility-state.ts`](../../../src/lib/data-selection/make-hierarchical-visibility-state.ts).
- `RecoilReadableStateFamily` — [`src/lib/mobile-tabs/TabNavigationAction.tsx`](../../../src/lib/mobile-tabs/TabNavigationAction.tsx), [`src/lib/data-map/legend/use-raster-color-map-values.tsx`](../../../src/lib/data-map/legend/use-raster-color-map-values.tsx).
- `ReadSelectorGetDefinition` — [`src/lib/data-map/state/make-view-layers-state.ts`](../../../src/lib/data-map/state/make-view-layers-state.ts), [`src/lib/data-map/state/make-view-layer-params-state.ts`](../../../src/lib/data-map/state/make-view-layer-params-state.ts).

---

### `lib/recoil/is-reset.ts`

```1:8:src/lib/recoil/is-reset.ts
import { DefaultValue } from 'recoil';

/** Check if argument is an instance of Recoil `DefaultValue` */
export const isReset = (candidate: unknown): candidate is DefaultValue => {
  if (candidate instanceof DefaultValue) return true;
  return false;
};
```

**Exports**

| Name      | Kind               | Signature                                           |
| --------- | ------------------ | --------------------------------------------------- |
| `isReset` | const (type guard) | `(candidate: unknown) => candidate is DefaultValue` |

**Behavior** Returns true when the argument is the Recoil sentinel returned by `useResetRecoilState` / `set(..., new DefaultValue())`. Used by writable selectors to detect "reset" upstream signals so they can cascade resets downstream.

**Consumers** — only [`src/lib/data-map/interactions/interaction-state.ts`](../../../src/lib/data-map/interactions/interaction-state.ts) (the `allowedGroupLayersState` selector's `set` branch).

---

### `lib/recoil/use-set-recoil-state-family.ts`

```25:31:src/lib/recoil/use-set-recoil-state-family.ts
export function useSetRecoilStateFamily<S, P>(stateFamily: RecoilStateFamily<S, P>) {
  return useRecoilCallback(({ set }) => {
    return (groupName: P, value: S) => {
      set(stateFamily(groupName), value);
    };
  });
}
```

**Exports**

| Name                      | Kind | Signature                                                                      |
| ------------------------- | ---- | ------------------------------------------------------------------------------ |
| `useSetRecoilStateFamily` | hook | `<S, P>(stateFamily: RecoilStateFamily<S, P>) => (param: P, value: S) => void` |

**Behavior** Returns a stable setter that accepts the family parameter at call time (rather than at hook time, as `useSetRecoilState(family(param))` would).

**Consumers** — [`src/lib/data-map/interactions/use-interactions.ts`](../../../src/lib/data-map/interactions/use-interactions.ts), [`src/lib/data-selection/sidebar/SubSectionToggle.tsx`](../../../src/lib/data-selection/sidebar/SubSectionToggle.tsx).

---

### `lib/recoil/StateWatcher.tsx`

```8:22:src/lib/recoil/StateWatcher.tsx
export function StateWatcher<T>({
  state,
  onValue,
}: {
  state: RecoilState<T>;
  onValue: (value: T) => void;
}) {
  const value = useRecoilValue(state);

  useEffect(() => {
    onValue(value);
  }, [onValue, value]);

  return null;
}
```

**Exports**

| Name              | Kind      | Signature                                                                 |
| ----------------- | --------- | ------------------------------------------------------------------------- |
| `StateWatcher<T>` | component | `(props: { state: RecoilState<T>; onValue: (value: T) => void }) => null` |

**Behavior** Subscribes to the state and runs the callback every time it changes (or whenever `onValue` identity changes). Note this is not a transaction — it's a plain `useEffect`. If `onValue` is not memoised, the effect re-runs more often than expected.

**Consumers** — [`src/lib/paths/EnforceSingleChild.tsx`](../../../src/lib/paths/EnforceSingleChild.tsx), [`src/lib/data-selection/sidebar/SubSectionToggle.tsx`](../../../src/lib/data-selection/sidebar/SubSectionToggle.tsx).

---

### `lib/recoil/make-state/make-select-state.ts`

```12:51:src/lib/recoil/make-state/make-select-state.ts
export function makeSelectState<T>(
  /**
   * Recoil key prefix
   */
  key: string,
  /**
   * Recoil state containing the list of options
   */
  optionsState: RecoilValueReadOnly<T[]>,

  /**
   * Function to select the default value from the list of options
   */
  defaultFn: DefaultFunction<T> = firstElem,
) {
  const selectedImpl = atom({
    key: `${key}/impl`,
    default: null,
  });

  const defaultImpl = selector({
    key: `${key}/default`,
    get: ({ get }) => defaultFn(get(optionsState)),
  });

  const resultState = selector({
    key,
    get: ({ get }) => {
      const selectedOption = get(selectedImpl);
      const options = get(optionsState);
      if (selectedOption == null || !options.includes(selectedOption)) {
        return get(defaultImpl);
      }
      return selectedOption;
    },
    set: ({ set }, newValue) => set(selectedImpl, newValue),
  });

  return resultState;
}
```

**Exports**

| Name                 | Kind    | Signature                                                                                                 |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `DefaultFunction<T>` | type    | `(options: T[]) => T`                                                                                     |
| `makeSelectState<T>` | factory | `(key: string, optionsState: RecoilValueReadOnly<T[]>, defaultFn?: DefaultFunction<T>) => RecoilState<T>` |

**Behavior** Produces a writable selector backed by an internal selection atom plus a default selector derived from `optionsState`. If the stored selection is `null` or not present in `optionsState`, returns the default; otherwise the stored value. Set writes the internal atom.

**Consumers** — [`src/details/features/damages/param-controls.tsx`](../../../src/details/features/damages/param-controls.tsx) (used 3× to make `selectedHazardState`, `selectedEpochState`, `selectedRpOptionState`).

---

### `lib/recoil/state-sync/use-sync-state.ts`

```7:32:src/lib/recoil/state-sync/use-sync-state.ts
export function useSyncValueToRecoil<T>(
  value: T,
  replicaState: RecoilState<T>,
  doSync: boolean = true,
) {
  const setState = useSetRecoilState(replicaState);

  useEffect(() => {
    if (doSync) {
      setState(value);
    }
  }, [doSync, setState, value]);
}

/**
 * Sync one piece of recoil state to another piece of recoil state
 */
export function useSyncState<T>(
  state: RecoilValueReadOnly<T>,
  replicaState: RecoilState<T>,
  doSync: boolean = true,
) {
  const value = useRecoilValue(state);

  useSyncValueToRecoil(value, replicaState, doSync);
}
```

**Exports**

| Name                      | Kind | Signature                                                                                 |
| ------------------------- | ---- | ----------------------------------------------------------------------------------------- |
| `useSyncValueToRecoil<T>` | hook | `(value: T, replicaState: RecoilState<T>, doSync?: boolean) => void`                      |
| `useSyncState<T>`         | hook | `(state: RecoilValueReadOnly<T>, replicaState: RecoilState<T>, doSync?: boolean) => void` |

**Behavior** Push-only mirroring of a value into a Recoil atom on every commit where it changes. Not transactional.

**Consumers**

- `useSyncValueToRecoil` — [`src/lib/data-map/interactions/use-interactions.ts`](../../../src/lib/data-map/interactions/use-interactions.ts), [`src/sidebar/LinkViewLayerToPath.tsx`](../../../src/sidebar/LinkViewLayerToPath.tsx), [`src/details/features/damages/DamagesSection.tsx`](../../../src/details/features/damages/DamagesSection.tsx).
- `useSyncState` — only used internally by `StateSyncRoot` below.

---

### `lib/recoil/state-sync/use-sync-state-throttled.ts`

```9:31:src/lib/recoil/state-sync/use-sync-state-throttled.ts
export function useSyncStateThrottled<T>(
  /**
   * Recoil state to sync from
   */
  state: RecoilValueReadOnly<T>,
  /**
   * Recoil state to sync to
   */
  replicaState: RecoilState<T>,
  /**
   * Throttle time in milliseconds
   */
  ms: number,
) {
  const value = useRecoilValue(state);
  const syncValue = useSetRecoilState(replicaState);

  const syncValueThrottled = useThrottledCallback(syncValue, ms);

  useEffect(() => {
    syncValueThrottled(value);
  }, [value, syncValueThrottled]);
}
```

**Exports**

| Name                       | Kind | Signature                                                                           |
| -------------------------- | ---- | ----------------------------------------------------------------------------------- |
| `useSyncStateThrottled<T>` | hook | `(state: RecoilValueReadOnly<T>, replicaState: RecoilState<T>, ms: number) => void` |

**Behavior** Same as `useSyncState` but the _write_ is throttled (`useThrottledCallback` from `@/lib/hooks/use-throttled-callback`). Used in [`src/state/map-view/map-view-state.ts`](../../../src/state/map-view/map-view-state.ts) to flush map pan/zoom into URL atoms at most every 2000 ms.

**Consumers** — [`src/state/map-view/map-view-state.ts`](../../../src/state/map-view/map-view-state.ts) (`useSyncMapUrl()` calls it three times: lat, lon, zoom).

---

### `lib/recoil/state-sync/StateSyncRoot.tsx`

```5:16:src/lib/recoil/state-sync/StateSyncRoot.tsx
export function StateSyncRoot<T>({
  state,
  replicaState,
  doSync = true,
}: {
  state: RecoilValueReadOnly<T>;
  replicaState: RecoilState<T>;
  doSync?: boolean;
}) {
  useSyncState(state, replicaState, doSync);
  return null;
}
```

**Exports**

| Name               | Kind      | Signature                                                                                            |
| ------------------ | --------- | ---------------------------------------------------------------------------------------------------- |
| `StateSyncRoot<T>` | component | `(props: { state: RecoilValueReadOnly<T>; replicaState: RecoilState<T>; doSync?: boolean }) => null` |

**Behavior** Render-anywhere wrapper around `useSyncState`. Used so consumers can declare sync in JSX rather than at the top of a hook body.

**Consumers** — only [`src/sidebar/url-state.tsx`](../../../src/sidebar/url-state.tsx) (`SidebarUrlStateSyncRoot`).

---

### `lib/recoil/sync-stores/RecoilLocalStorageSync.tsx`

The largest helper. Implements a `RecoilSync` provider backed by `window.localStorage`.

```62:73:src/lib/recoil/sync-stores/RecoilLocalStorageSync.tsx
export const RecoilLocalStorageSync: FC<SetOptional<RecoilSyncOptions, 'read' | 'write'>> = (
  props,
) => {
  return (
    <RecoilSync
      read={readLocalStorage}
      write={writeLocalStorage}
      listen={listenLocalStorage}
      {...props}
    />
  );
};
```

**Exports**

| Name                     | Kind      | Signature                                                                                                                                                             |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RecoilLocalStorageSync` | component | `FC<SetOptional<RecoilSyncOptions, 'read' \| 'write'>>` — i.e. props are `RecoilSync` options with `read`/`write` made optional because the wrapper supplies defaults |

**Behavior subtleties** (all from the source above):

- **Read** — `JSON.parse` with a reviver that turns ISO date strings (matched against `dateRegex`) into `Date` instances. Missing key → `new DefaultValue()`.
- **Write** — walks `diff` and either `removeItem` for `DefaultValue` or `setItem(JSON.stringify(value))`.
- **Listen** — `window.addEventListener('storage', ...)`. Ignores `localStorage.clear()` events (`event.key === null`). Falls back to `DefaultValue` on missing `newValue` or `parseJSON` failure (`console.warn` on parse error).

**Consumers** — only [`src/App.tsx`](../../../src/App.tsx) (mounted as `<RecoilLocalStorageSync storeKey="local-storage">`).

Note that any atom that opts into this store does so by adding `syncEffect({ storeKey: 'local-storage', ... })`. Today, that's `submittedJobsState` and `completedJobsState` in [`src/modules/downloads/data/jobs.ts`](../../../src/modules/downloads/data/jobs.ts).

---

### `lib/recoil/state-effects/types.ts`

```1:36:src/lib/recoil/state-effects/types.ts
import { CallbackInterface, TransactionInterface_UNSTABLE } from 'recoil';

export type StateEffectAtomicInterface = TransactionInterface_UNSTABLE;

/**
 * Type for a function to be used as a state effect.
 * The function will be called with the Recoil transaction interface (get, set, reset),
 * the current value, and previous value of the tracked state.
 */
export type StateEffect<T> = (ops: StateEffectAtomicInterface, value: T, previousValue: T) => void;

/**
 * Like StateEffect<T> but without the previous value
 */
export type CurrentStateEffect<T> = (ops: StateEffectAtomicInterface, value: T) => void;

export type StateEffectAsyncInterface = Pick<CallbackInterface, 'snapshot' | 'set' | 'reset'>;

/**
 * Type for a function to be used as an async state effect.
 * The function will be called with the Recoil async interface (snapshot, set, reset),
 * the current value, and previous value of the tracked state.
 */
export type StateEffectAsync<T> = (
  ops: StateEffectAsyncInterface,
  value: T,
  previousValue: T,
) => void;

/**
 * Like StateEffectAsync<T> but without the previous value
 */
export type CurrentStateEffectASync<T> = (ops: StateEffectAsyncInterface, value: T) => void;
```

**Exports**

| Name                         | Kind | Description                                                                   |
| ---------------------------- | ---- | ----------------------------------------------------------------------------- |
| `StateEffectAtomicInterface` | type | `TransactionInterface_UNSTABLE` — `get`/`set`/`reset` inside a transaction    |
| `StateEffect<T>`             | type | atomic effect that receives `(ops, newValue, previousValue)`                  |
| `CurrentStateEffect<T>`      | type | atomic effect without `previousValue`                                         |
| `StateEffectAsyncInterface`  | type | `Pick<CallbackInterface, 'snapshot' \| 'set' \| 'reset'>`                     |
| `StateEffectAsync<T>`        | type | async effect with `(ops, newValue, previousValue)`                            |
| `CurrentStateEffectASync<T>` | type | async effect without `previousValue` (note the typo `ASync` is in the source) |
| `EffectHookType`             | type | `'effect' \| 'layoutEffect'`                                                  |

**Consumers**

- `StateEffect`, `CurrentStateEffect`, `StateEffectAtomicInterface` — [`src/sidebar/sections/risk/infrastructure-risk.tsx`](../../../src/sidebar/sections/risk/infrastructure-risk.tsx), [`src/state/data-selection/hazards.ts`](../../../src/state/data-selection/hazards.ts).
- The async types are referenced only via the hooks/wrappers below.

---

### `lib/recoil/state-effects/use-state-effect.ts`

```28:73:src/lib/recoil/state-effects/use-state-effect.ts
function useStateEffect<T>(
  state: RecoilValueReadOnly<T>,
  stateLogicCallback: StateLogicCallback<T>,
  hookType: EffectHookType,
) {
  const stateValue = useRecoilValue(state);
  const previousStateValue = usePrevious(stateValue);

  const useSomeEffect = useConditionalHook(hookType === 'effect', useEffect, useLayoutEffect);
  useSomeEffect(
    () => stateLogicCallback(stateValue, previousStateValue),
    [stateLogicCallback, stateValue, previousStateValue],
  );
}

/**
 * Watch a Recoil state and execute a state effect (atomically - inside a transaction) when the state changes.
 */
export function useStateEffectAtomic<T>(
  /** State to watch */
  state: RecoilValueReadOnly<T>,
  /** Effect to apply upon change */
  effect: StateEffect<T>,
  /** Whether to use useEffect or useLayoutEffect hook */
  hookType: EffectHookType = 'effect',
) {
  const cb = useStateLogicAtomicCallback(effect);

  useStateEffect(state, cb, hookType);
}

/**
 * Watch a Recoil state and execute a state effect (asynchronously - inside `useRecoilCallback`) when the state changes.
 */
export function useStateEffectAsync<T>(
  /** State to watch */
  state: RecoilValueReadOnly<T>,
  /** Effect to apply upon change */
  effect: StateEffectAsync<T>,
  /** Whether to use useEffect or useLayoutEffect hook */
  hookType: EffectHookType = 'effect',
) {
  const cb = useStateLogicAsyncCallback(effect);

  useStateEffect(state, cb, hookType);
}
```

**Exports**

| Name                      | Kind | Signature                                                                                                                    |
| ------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------- |
| `useStateEffectAtomic<T>` | hook | `(state, effect, hookType?) => void` — runs the effect inside `transact_UNSTABLE`                                            |
| `useStateEffectAsync<T>`  | hook | `(state, effect, hookType?) => void` — runs the effect inside a `useRecoilCallback`, with `snapshot`/`set`/`reset` available |

**Behavior subtleties**

- `usePrevious` (see [`src/lib/hooks/use-previous.ts`](../../../src/lib/hooks/use-previous.ts)) returns `undefined` on first render — so the effect fires on mount with `previousValue === undefined`. Many call sites guard against this (e.g. `viewTransitionEffect` in [`src/sidebar/SidebarContent.tsx`](../../../src/sidebar/SidebarContent.tsx) checks `if (newView === previousView) return`).
- The atomic path wraps the callback in `transact_UNSTABLE`, which currently does not allow reading from selectors. This drives one explicit design constraint in [`src/state/data-params.ts`](../../../src/state/data-params.ts) (see the docstring on `useLoadParamsConfig`) and in [`src/sidebar/sections/risk/population-exposure.tsx`](../../../src/sidebar/sections/risk/population-exposure.tsx) (`syncExposure` writes the leaf atomFamily rather than the hierarchical selector).
- Effect order is the React render order of the `StateEffectRoot`/`StateEffectRootAsync` instances, as documented on those components.

**Consumers** — none outside [`src/lib/recoil/state-effects/`](../../../src/lib/recoil/state-effects/); they are wrapped by `StateEffectRoot{,Async}` below.

---

### `lib/recoil/state-effects/StateEffectRoot.tsx`

```12:44:src/lib/recoil/state-effects/StateEffectRoot.tsx
export const StateEffectRoot = <T,>({
  state,
  effect,
  hookType = 'effect',
}: {
  state: RecoilValueReadOnly<T>;
  effect: StateEffect<T>;
  hookType?: EffectHookType;
}) => {
  useStateEffectAtomic(state, effect, hookType);

  return null;
};

/**
 * The root of an async state effect. When this component is rendered, the
 * effect will be executed (asynchronously) upon every change to the state.
 *
 * Effects are executed in the order in which the effect roots are rendered.
 */
export const StateEffectRootAsync = <T,>({
  state,
  effect,
  hookType = 'effect',
}: {
  state: RecoilValueReadOnly<T>;
  effect: StateEffectAsync<T>;
  hookType?: EffectHookType;
}) => {
  useStateEffectAsync(state, effect, hookType);

  return null;
};
```

**Exports**

| Name                      | Kind      | Signature                                                |
| ------------------------- | --------- | -------------------------------------------------------- |
| `StateEffectRoot<T>`      | component | `(props: { state; effect; hookType? }) => null` (atomic) |
| `StateEffectRootAsync<T>` | component | same, but uses `useStateEffectAsync`                     |

**Consumers**

- `StateEffectRoot` — [`src/sidebar/sections/risk/infrastructure-risk.tsx`](../../../src/sidebar/sections/risk/infrastructure-risk.tsx) (twice — sector and hazard sync), [`src/sidebar/sections/risk/population-exposure.tsx`](../../../src/sidebar/sections/risk/population-exposure.tsx).
- `StateEffectRootAsync` — [`src/sidebar/SidebarContent.tsx`](../../../src/sidebar/SidebarContent.tsx) (`viewTransitionEffect` on `viewState`).

---

### Summary table of `src/lib/recoil/` consumers, by imported symbol

| Imported symbol                                                     | Source file                                         | Consumers (count)   |
| ------------------------------------------------------------------- | --------------------------------------------------- | ------------------- |
| `RecoilStateFamily`                                                 | `lib/recoil/types.ts`                               | 9                   |
| `RecoilReadableStateFamily`                                         | `lib/recoil/types.ts`                               | 2                   |
| `ReadSelectorGetDefinition`                                         | `lib/recoil/types.ts`                               | 2                   |
| `isReset`                                                           | `lib/recoil/is-reset.ts`                            | 1                   |
| `useSetRecoilStateFamily`                                           | `lib/recoil/use-set-recoil-state-family.ts`         | 2                   |
| `StateWatcher`                                                      | `lib/recoil/StateWatcher.tsx`                       | 2                   |
| `makeSelectState`                                                   | `lib/recoil/make-state/make-select-state.ts`        | 1                   |
| `useSyncValueToRecoil`                                              | `lib/recoil/state-sync/use-sync-state.ts`           | 3                   |
| `useSyncState`                                                      | `lib/recoil/state-sync/use-sync-state.ts`           | 0 _(internal only)_ |
| `useSyncStateThrottled`                                             | `lib/recoil/state-sync/use-sync-state-throttled.ts` | 1                   |
| `StateSyncRoot`                                                     | `lib/recoil/state-sync/StateSyncRoot.tsx`           | 1                   |
| `RecoilLocalStorageSync`                                            | `lib/recoil/sync-stores/RecoilLocalStorageSync.tsx` | 1                   |
| `StateEffectRoot`                                                   | `lib/recoil/state-effects/StateEffectRoot.tsx`      | 2                   |
| `StateEffectRootAsync`                                              | `lib/recoil/state-effects/StateEffectRoot.tsx`      | 1                   |
| `StateEffect` / `CurrentStateEffect` / `StateEffectAtomicInterface` | `lib/recoil/state-effects/types.ts`                 | 2 / 1 / 1           |
| `useStateEffectAtomic` / `useStateEffectAsync`                      | `lib/recoil/state-effects/use-state-effect.ts`      | 0 _(internal only)_ |

Total: 24 import sites outside [`src/lib/recoil/`](../../../src/lib/recoil/).

---

## §1.7 Notable items

These are easy to miss in a simple grep, so call them out explicitly — they shape the migration plan.

### Atoms with intentional Suspense-on-mount

[`src/state/data-params.ts`](../../../src/state/data-params.ts) sets `default: () => new Promise(() => {})` on `paramsConfigState` and `paramsState`. This makes any `useRecoilValue` on the families suspend until `useLoadParamsConfig` hydrates them. The Jotai analog needs an async atom whose initial promise never resolves until set, or a different design (e.g. `loadable` + explicit `null` state). See §2.1 for discussion.

### Atom that defaults from another atom

[`src/sidebar/SidebarContent.tsx`](../../../src/sidebar/SidebarContent.tsx) declares:

```54:57:src/sidebar/SidebarContent.tsx
export const sidebarExpandedState = atomFamily({
  key: 'sidebarExpandedState',
  default: sidebarVisibilityToggleState,
});
```

`default` is the other atomFamily itself, which Recoil resolves _per param_. Jotai's `atomFamily` does not accept an atom as a default — the equivalent would be a derived `atom((get) => get(otherFamily(param)))` used as the default.

### Writable selector with `dangerouslyAllowMutability`

[`src/state/map-view/map-view-state.ts`](../../../src/state/map-view/map-view-state.ts):

```26:52:src/state/map-view/map-view-state.ts
export const mapViewStateState = selector({
  key: 'mapViewState',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    const viewState = {
      ...get(nonCoordsMapViewStateState),
      latitude: get(mapLatState),
      longitude: get(mapLonState),
      zoom: get(mapZoomState),
    };
    return viewState;
  },
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(mapZoomState);
      reset(mapLatState);
      reset(mapLonState);
      reset(nonCoordsMapViewStateState);
    } else {
      const { latitude, longitude, zoom, ...nonCoords } = newValue;
      set(mapZoomState, zoom);
      set(mapLonState, longitude);
      set(mapLatState, latitude);
      set(nonCoordsMapViewStateState, nonCoords);
    }
  },
});
```

`dangerouslyAllowMutability` exists because deck.gl mutates the view-state object internally. Jotai does not run a mutation check by default, so the flag becomes a no-op in the migrated code — but the deeper invariant (object identity-stable view state) still matters; verify with `npm run build && npm run dev` once converted.

### Cross-tab storage sync subtleties

`RecoilLocalStorageSync` ignores `localStorage.clear()` (`event.key === null`) and downgrades `parseJSON` failures to `DefaultValue` with a `console.warn`. ISO date strings are revived to `Date` instances via `dateRegex` — used by `submittedJobsState`/`completedJobsState` which store `inserted: Date`. The Jotai replacement must preserve both behaviors.

### Async-selector handling via `noWait` + Loadable shape

[`src/details/features/damages/DamagesSection.tsx`](../../../src/details/features/damages/DamagesSection.tsx):

```21:29:src/details/features/damages/DamagesSection.tsx
export const hazardDataParamsState = selector({
  key: 'DamagesSection/hazardDataParams',
  get: ({ get }) => {
    return _.mapValues(HAZARD_DOMAINS_CONFIG, (_, hazard) => {
      const c = get(noWait(paramsConfigState(hazard)));
      return c.state === 'hasValue' ? c.contents : undefined;
    });
  },
});
```

Reads the suspending `paramsConfigState` family **inside a selector** without suspending. Jotai's equivalent uses `loadable()` from `jotai/utils`.

### `Loadable` via `snapshot.getLoadable`

[`src/lib/data-selection/sidebar/SubSectionToggle.tsx`](../../../src/lib/data-selection/sidebar/SubSectionToggle.tsx) reads `loadable` values from a `useRecoilCallback` `snapshot`. Jotai has no `snapshot` API; the equivalent is reading from a store via `useStore` / `useAtomCallback` with `loadable(...)`.

### Atoms exported but never consumed

- `naturalAssetsSelectionState` ([`src/state/data-selection/natural-assets.ts`](../../../src/state/data-selection/natural-assets.ts)).
- `hoveredAdaptationFeatureState` ([`src/config/nbs/components/FeatureAdaptationsTable.tsx`](../../../src/config/nbs/components/FeatureAdaptationsTable.tsx)) — the hover path uses `boundedFeatureState` instead.

These can be deleted before migration begins.

### Atoms written but never directly read by hooks

- `completedJobsState` is mutated by `moveJobToCompletedTransaction` but no hook subscribes to it; it remains in the graph because of the cross-atom transaction with `submittedJobsState` and because it's persisted to local storage.

### Sync store keys in use

| Store key        | Mounted at                           | Atoms that opt in via `syncEffect`                                                                                                                                                                              |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `local-storage`  | `App.tsx` (`RecoilLocalStorageSync`) | `submittedJobsState`, `completedJobsState`                                                                                                                                                                      |
| `url-json`       | `App.tsx` (`RecoilURLSyncJSON`)      | `mapZoomUrlState`, `mapLonUrlState`, `mapLatUrlState`, `pixelDrillerSiteUrlState`, `sidebarSectionsUrlParamsState`, and via `defaultSectionVisibilitySyncEffect` for every `sidebarVisibilityToggleState(path)` |
| `map-view-route` | `MapViewRouteSync` (route subtree)   | `viewState`                                                                                                                                                                                                     |
