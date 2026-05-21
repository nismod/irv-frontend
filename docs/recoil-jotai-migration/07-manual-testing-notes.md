# How to test the features after the migration

## Place search

- go to the map page
- click on the place search field
- type "London"
- select the "London" result
- confirm the map flies to London
- confirm the place search field collapses after clicking away or pressing escape
- re-expand the place search field, type "New York", select the "New York" result, confirm the map flies to New York
- navigate to About page and back
- confirm the place search query persists

## Mobile tabs

- shrink to mobile width (potentially with the devtools responsive mode)
- go to the map page
- confirm the tabs menu shows Layers, Legend, Selection with only Layers enabled
- turn on one layer visibility, e.g. River Flooding
- confirm the Legend tab becomes enabled
- click on the Legend tab
- confirm the Legend tab content is displayed
- switch back to the Layers tab
- navigate to the Risk view
- turn on Infrastructure Risk
- zoom in to the map and click on a vector feature (e.g. a road)
- confirm the Selection tab becomes enabled
- click on the Selection tab
- confirm the Selection tab content is displayed with details for the clicked feature
- click on an empty area of the map
- confirm the Selection tab content is cleared

## Pixel driller

- go to the map page
- turn on pixel driller mode using the HUD button
- click on the map to set the click location
- confirm the pixel driller panel is displayed with the details for the clicked location
- expand one of the hazard accordion sections that are available for the clicked location
- confirm the hazard accordion section is expanded
- expand another hazard accordion section
- confirm the first hazard accordion section is collapsed and the second hazard accordion section is expanded
- click on the map to set a new click location
- confirm the new location data is displayed in the pixel driller panel and the second expanded hazard accordion section is still expanded
- when clicking to pick new locations, confirm that the URL is updated with a `site=<lat>,<lng>` parameter
- hit F5 to refresh the page
- confirm the pixel driller panel is displayed with the details for the most recently clicked location
- clear the site selection by clicking the clear button in the pixel driller panel
- confirm the URL is updated to remove the `site` parameter

## Map view state

- go to the map page - Hazard view
- confirm the map is displayed with the initial view state
- confirm the URL is updated to include the `x`, `y`, and `z` parameters
- zoom in to a point off the center of the map
- confirm the URL is updated to include the new `x`, `y`, and `z` parameters
- go to the About page
- confirm the URL does not include the `x`, `y`, and `z` parameters
- navigate to the map page - Hazard view again
- confirm the map is displayed at the same location as before the navigation to the About page
- confirm the URL includes the `x`, `y`, and `z` parameters for the Hazard view
- navigate to the map page - Exposure view
- confirm the map is still displayed at the same location as before the navigation to the Exposure view
- confirm the URL includes the `x`, `y`, and `z` parameters for the Exposure view
- refresh the page
- confirm the map is still displayed at the same location as before the refresh
- confirm the URL includes the `x`, `y`, and `z` parameters for the Exposure view

## Damages / data-params config (Slice 8)

Param **values** migrated in Slice 14 — the tests below cover both config loading (Slice 8) and value updates (Slice 14).

### Hazards section param dropdowns

- go to map page - Hazard view
- expand each hazard control once (Fluvial, Coastal, Cyclone, CDD, Extreme Heat, Drought, Landslide, Earthquake)
- for each: confirm every param dropdown (epoch / RCP / SSP / GCM / return period / trigger, where applicable) is populated with values
- in one hazard, change RCP and confirm Epoch / return period dropdowns reflow correctly (some combinations disappear or change)

### Infrastructure risk section

- go to map page - Risk view, open Infrastructure Risk
- toggle the sector dropdown (Roads / Rail / Power) — confirm the hazard dropdown options reflow accordingly (Power → Cyclone only, etc.)
- switch the hazard and confirm the map damage layer updates

### Damages drill-down (right-hand asset panel)

- on map page - Risk view, turn on Infrastructure Risk and ensure a sector layer is visible on the map
- zoom in and click an asset (e.g. a road segment)
- confirm the right-hand "Asset details" panel renders the Expected Annual Damages section and Return Period Damages section
- confirm the hazard / epoch / return-period dropdowns are populated
- change hazard, epoch, and return period filters; confirm the charts and tables update accordingly
- click "Download CSV" on each section; confirm a CSV file is downloaded with the expected columns
- click a different asset and confirm the panel re-renders with the new feature's data
- deselect (click the deselect button or click empty map area) and confirm the panel closes

## Map interactions + view-layer params

### Map interactions

- go to map page - Exposure view
- turn on Infrastructure layer
- from the Infrastructure sidebar section, select the Roads sector
- zoom in to see some vector assets up close
- hover over an asset on the map
- confirm the hover tooltip is displayed with the asset's details
- click on an asset to select it
- confirm the right-hand "Asset details" panel renders containing the selected road's details and the asset on the map is highlighted, even when not hovering over it
- deselect the asset by clicking the deselect button
- confirm the right-hand "Asset details" panel closes and the asset on the map is no longer highlighted
- select another asset by clicking on it
- click on an empty area of the map
- confirm the asset on the map is no longer highlighted and the right-hand "Asset details" panel closes
- now click again to select an asset
- in the left-hand sidebar, select the Rail sector, and then deselect the Roads sector
- confirm the asset on the map is no longer highlighted and the right-hand "Asset details" panel closes
- now re-select the Roads sector
- confirm the asset on the map is no longer highlighted

### NBS scope regions layer

- go to map page - Adaptations view
- ensure Nature-Based Solutions is enabled
- ensure the scope region level is set to Country
- hover over a country on the map
- confirm a notice is displayed in the tooltip that you can click on the region to view adaptations in this region
- click on a country to select it
- confirm the NBS Prioritisation panel is displayed with the adaptations table for the selected country
- confirm the NBS Prioritisation panel contains the name of the selected country in the title
- click on an empty area of the map
- confirm the selected country is still selected and the NBS Prioritisation panel is still displayed
- change the scope region level to Admin 1
- confirm the NBS Prioritisation panel disappears and no region is selected
- switch back to Country scope level
- confirm the NBS Prioritisation panel is still not displayed, and no region is selected

## Map basemap

- go to map page - any view
- open the basemap control (layers icon, bottom-left HUD)
- switch between Map and Satellite — confirm basemap updates
- toggle "Show labels" off and on — confirm label visibility changes
- go to Adaptation view with Nature-Based Solutions enabled
- with scope level Country, confirm scope-region boundaries/labels remain readable on both basemaps

## NbS adaptation

### Controls and map layers

- go to map page - Adaptations view, enable Nature-Based Solutions
- change adaptation type, geographic scope, color-by variable, and hazard (where shown)
- confirm the NbS data layer and scope-region overlay update on the map
- switch color-by from a continuous variable (e.g. Avoided EAD) to a categorical one — confirm map styling changes (no prioritisation table)

### Scope region selection and prioritisation panel

- set scope level to Country, color-by to a continuous variable
- click a country — confirm prioritisation panel opens with region name in title and adaptations table
- hover rows in the table — confirm a bounding-box highlight appears on the map for that feature
- click zoom-in on a row — confirm map zooms to feature; click zoom-out — confirm map returns to region extent
- deselect by clicking empty map — confirm region stays selected and panel remains (existing behaviour)

### Basemap interaction with scope regions

- with a country selected and scope regions visible, switch basemap Map ↔ Satellite and toggle labels — confirm scope-region layer outline and label colours remain legible

## Networks / damages styling (Slice 11)

### Infrastructure risk (damage map styling)

- go to `/view/risk`, expand Infrastructure Risk
- toggle sector (Roads / Rail / Power) — confirm network layers on the map update to match sector defaults
- toggle hazard — confirm damage choropleth / styling updates and hazard sidebar visibility toggles follow
- change epoch and RCP — confirm damage layer colours update

### Exposure infrastructure (network tree)

- go to `/view/exposure`, expand Infrastructure
- toggle individual network layers in the tree — confirm matching infrastructure layers appear/disappear on the map
- collapse/expand tree nodes — confirm UI state persists while toggling
- navigate away from Exposure and back — confirm layer visibility gating still correct

### Cross-view styling (Slice 11 fix)

- on `/view/risk`, enable Infrastructure Risk — confirm damage choropleth styling
- switch to `/view/exposure`, enable Infrastructure — confirm **standard type colours**, not damage styling

### Known bug (pre-existing — do not regress, not fixed in Slice 11)

- enable Infrastructure Risk on `/view/risk`, switch to another view, return to `/view/risk` — sidebar may show Infrastructure Risk visible but map layers absent until toggled off/on. Defer to Slice 15 (`syncExposure` remount vs `viewTransitionEffect` timing).

## Population & regional exposure (Slice 12)

### Population exposure (`/view/risk` → Population Exposure)

- switch hazard radio (Extreme Heat / Droughts) — confirm map layer updates and matching hazard sidebar visibility toggles follow
- change epoch and RCP — confirm population exposure choropleth updates (`populationExposureGroupParamsReplicaAtom` bridge)
- toggle Population layer and Hazard layer switches — confirm map gating

### Regional summary (`/view/risk` → Regional Summary)

- change "Population exposed to" dropdown — confirm regional choropleth updates on map

### Risk sub-section switching

- switch between Population Exposure, Infrastructure Risk, and Regional Summary — confirm only the active section's exposure sidebar leaf and map layer show (exercises `syncExposure` via `useRecoilCallback`)

## Hazards selection (Slice 13)

### Hazard view (`/view/hazard`)

- enable several hazard layers (e.g. Extreme Heat, Drought, River Flooding → Aqueduct) — confirm map raster layers appear
- change epoch and RCP on one hazard — confirm map layer updates (`hazardGroupParamsReplicaAtomFamily` bridge)
- disable a hazard — confirm its map layer disappears

### Cross-view hazard sync (Population / Infrastructure Risk)

- on `/view/risk` → Population Exposure, switch hazard radio — confirm matching hazard sidebar path toggles follow
- on `/view/risk` → Infrastructure Risk, switch hazard dropdown — confirm matching hazard sidebar path toggles follow
