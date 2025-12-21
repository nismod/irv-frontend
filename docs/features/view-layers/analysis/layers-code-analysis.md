# Layers code analysis

Interaction groups analysis:
| id | type | pickingRadius | pickMultiple | usesAutoHighlight | deselectOnClickEmpty | View layers |
| ---------------- | ------ | ------------- | ------------ | ----------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ig:assets | vector | 8 | No | Yes | Yes | healthsites-view-layer, industry-view-layer, nbs-layer, infrastructure-view-layer |
| ig:hazards | raster | | Yes | No | No | hazard-view-layer, exposure-view-layer |
| ig:rexp | vector | 8 | No | Yes | Yes | regional-risk-layer |
| ig:hdi | vector | | No | Yes | Yes | human-development-layer |
| ig:wdpa | vector | 0 | Yes | Yes | Yes | protected-area-layer |
| ig:raster_assets | raster | | Yes | No | No | building-density-layer, cdd-view-layer, hdi-grid-layer, land-cover-layer, nature-raster-layer, population-view-layer, rwi-layer, topography-view-layer, travel-time-layer |
| ig:scope_regions | vector | | No | Yes | No | scope-regions-layer |

Observations:

- for `raster` groups:
  - most will have `pickMultiple: true`
  - most will have `pickingRadius: 0` (picking radius doesn’t really matter for raster tile layers as most will just cover the whole world with potentially empty/transparent tiles, so the picking will always have something to pick directly under the cursor. For a hypothetical case where a raster layer covers only part of the map, we probably wouldn’t want a different picking radius anyway).
  - all (?) will have `usesAutoHighlight: false`
  - `hazards` and `raster_assets` have identical parameters and `pickMultiple: true`, so the main reason of a split is for querying in tooltip etc
- for `vector` groups:
  - most have `pickMultiple: false` but `wdpa` is a counter-example
  - `pickingRadius: 8` is popular for smaller features (lines/points)
  - `pickingRadius: 0` is popular for region shapes
  - most will have `deselectOnClickEmpty: true` (default) but `scope_regions` is `false` explicitly
  - `assets` and `rexp` have identical parameters. This means the distinction is for:
    - querying in tooltips etc
    - separate “conflict group”, seeing that they both have `pickMultiple: false`
  - there is a discrepancy between auto-highlight and tooltip content: because only one group influences the global pickingRadius, even if groups after the primary one have a different picking radius (e.g. 0) it only affects the tooltip, but not the auto-highlight which is still at 8
    - `wdpa` is affected by this, but if it wasn’t then ideally the two different deck layers that are in the view layer (polygons and points) should actually have different interaction settings. The points should have `pickingRadius: 8` and the polygons - `0` . But they should be possible to query together in the tooltip. Their placement in the layer stack is already different, but the interaction settings are not.

View layers analysis:

| Filename                    | Interaction Group  | id                                                                                             | Uses asset layer fn |
| --------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- | ------------------- |
| `building-density-layer`    | `ig:raster_assets` | `buildings`                                                                                    | No                  |
| `cdd-view-layer`            | `ig:raster_assets` | `cdd_absolute`, `cdd_relative`                                                                 | No                  |
| `exposure-view-layer`       | `ig:hazards`       | `[hazard_type]_exposure`                                                                       | No                  |
| `hazard-view-layer`         | `ig:hazards`       | `[hazard_type]`                                                                                | No                  |
| `hdi-grid-layer`            | `ig:raster_assets` | `hdi-grid`                                                                                     | No                  |
| `healthsites-view-layer`    | `ig:assets`        | `healthsites`                                                                                  | Yes                 |
| `human-development-layer`   | `ig:hdi`           | `hdi_[regionLevel]`                                                                            | No                  |
| `industry-view-layer`       | `ig:assets`        | `cement`, `steel`                                                                              | Yes                 |
| `land-cover-layer`          | `ig:raster_assets` | `land_cover`                                                                                   | No                  |
| `nature-raster-layer`       | `ig:raster_assets` | `nature_biodiversity_intactness`, `nature_forest_landscape_integrity`, `nature_organic_carbon` | No                  |
| `nbs-layer`                 | `ig:assets`        | `nbs_cf`, `nbs_ls`, `nbs_rf`                                                                   | Yes                 |
| `scope-regions-layer`       | `ig:scope_regions` | `scope_regions`                                                                                | No                  |
| `infrastructure-view-layer` | `ig:assets`        | `[infrastructureType]`                                                                         | Yes                 |
| `population-view-layer`     | `ig:raster_assets` | `population`                                                                                   | No                  |
| `protected-area-layer`      | `ig:wdpa`          | `wdpa_[type]_[shapeType]`                                                                      | No                  |
| `regional-risk-layer`       | `ig:rexp`          | `adm0_exposure`                                                                                | No                  |
| `rwi-layer`                 | `ig:raster_assets` | `rwi`                                                                                          | No                  |
| `topography-view-layer`     | `ig:raster_assets` | `topography_elevation`, `topography_slope`                                                     | No                  |
| `travel-time-layer`         | `ig:raster_assets` | `traveltime_to_healthcare_motorized`, `traveltime_to_healthcare_walking`                       | No                  |

### Additional observations / side notes

- `viewLayer.params` is used only once - in WdpaHoverDescription (viewLayer.params.type)

## Conclusions / steps to improve

- introduce more ways for querying view layers in places like the tooltip - not only based on the interaction group, but also based on view layer id (or some sort of tags that the layers can manually set?)
  - → for this, the interaction state (selected / hovered) needs to be stored per view layer, and not per interaction group like it is now
- separate “picking style” configuration from “conflict groups” handling
  - many layers can share the same style of picking that can be defined somewhere centrally and imported into layer definitions
    - is `pickingRadius` essentially the main bit that defines the “style” of picking?
      - for the deck-specific things - yes, but then what happens with the picking info is different (raster vs vector processing, what to do on clicking an empty space etc)
    - what are examples of different picking “styles” in this context?
      - `pickingRadius: 8` for picking lines, points etc
      - `pickingRadius: 0` for picking vector regions, or raster layers
  - but each can be in a different “conflict group”. For example:
    - `null` - no conflict group. The layer will always be picked regardless of other overlapping layers
    - `'some-name'` - all interactions with the same group will “compete” for interaction events
    - perhaps `'builtin'` should represent the default Deck picking mechanism?
    - can layers with a different picking style be in the same conflict group? How would this be implemented? Intuitively this maybe wouldn’t make sense, but at the same time we’d need to have a way to prevent misconfigurations here. Perhaps the library should verify that layers in the same group have the same picking parameters, and complain otherwise?
- introduce an `interactions` property to `ViewLayer` - at first have it alongside `interactionGroup`, and gradually implement support for raster layers first, move those to the new mechanism, then do the same for vector layers
- move away from the framework-managed `viewLayerParams` (which are essentially centrally-managed layer state objects and currently only contain the centrally-managed `selection` ) towards a view layer `state` that each layer manages itself
  - the `state` should be available in `fn` , `renderLegend` , `renderTooltip` etc (just like `deckProps`, `zoom` and the current `selection` )
  - it should be possible to modify it in these places:
    - in the layer’s interaction handlers
    - in the UI components (tooltip, legend, details)
    - externally? (for example, set `state.highlight` from the adaptations table)
      - how would external code modify this? Need to specify a view layer by ID?
  - need to figure out the exact way to allow for these updates e.g. from React, so that everything (both Deck map and React components) gets re-rendered correctly after a layer state update
- need to allow extra interaction event handlers on the global level. There could be a range of layers that specify their own `onClick` handlers, but also the `irv-pixel-driller` might want to add a global `onClick` handler (that is not specific to a single view layer)
- There is a potential pitfall with how the current picking works - we are using `layerIds` in picking params, and we set it based on view layer IDs from active interaction groups - and the way this works in Deck is that the matching of the layer IDs is not exact, but based on comparing the start of the string (they do it so that the `layerId` filtering includes child layers of composite layers). This means that if we had two view layers where one of them had an ID that was a prefix of the other (e.g. `hazard` is a string prefix of `hazard_exposure` ) then if we include `hazard` in the picking, `hazard_exposure` would also be included. So far, we didn’t run into an issue with this because of how the app was configured.
