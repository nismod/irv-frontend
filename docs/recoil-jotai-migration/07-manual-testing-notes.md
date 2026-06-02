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

## Damages and hazard parameters

The tests below cover loading parameter options and changing values in the sidebar.

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

## Networks and damage map styling

### Infrastructure risk (damage map styling)

- go to Risk view, expand Infrastructure Risk
- toggle sector (Roads / Rail / Power) — confirm network layers on the map update to match sector defaults
- toggle hazard — confirm damage choropleth / styling updates and hazard sidebar visibility toggles follow
- change epoch and RCP — confirm damage layer colours update

### Exposure infrastructure (network tree)

- go to Exposure view, expand Infrastructure
- toggle individual network layers in the tree — confirm matching infrastructure layers appear/disappear on the map
- collapse/expand tree nodes — confirm UI state persists while toggling
- navigate away from Exposure and back — confirm layer visibility gating still correct

### Cross-view styling

- on Risk view, enable Infrastructure Risk — confirm damage choropleth styling
- switch to Exposure view, enable Infrastructure — confirm **standard type colours**, not damage styling

### Risk view navigation round-trip

- on Risk view, enable Infrastructure Risk — confirm damage layers appear on the map
- switch to another view (e.g. Hazard or Exposure), then return to Risk view
- confirm Infrastructure Risk is still selected in the sidebar **and** the map layers are still visible (no need to toggle the section off and on)
- repeat with Population Exposure and Regional Summary: leave Risk, come back, confirm the last active risk section still shows its map layers

## Population & regional exposure

### Population exposure (Risk view → Population Exposure)

- switch hazard radio (Extreme Heat / Droughts) — confirm the map layer updates and the matching hazard toggles in the sidebar follow
- change epoch and RCP — confirm the population exposure map updates
- toggle the Population layer and Hazard layer switches — confirm map visibility matches the switches

### Regional summary (Risk view → Regional Summary)

- change the "Population exposed to" dropdown — confirm the regional map updates

### Switching between risk sections

- switch between Population Exposure, Infrastructure Risk, and Regional Summary — confirm only the active section's map layer is shown and the exposure sidebar reflects the active choice

### Infrastructure risk controls (Risk view → Infrastructure Risk)

- change the sector dropdown — confirm the network layers on the map reset to that sector's defaults
- change the hazard dropdown — confirm the hazard layer in the sidebar and the damage styling on the map both update

## Hazards selection

### Hazard view

- enable several hazard layers (e.g. Extreme Heat, Drought, River Flooding) — confirm matching map layers appear
- change epoch and RCP on one hazard — confirm that hazard's map layer updates
- disable a hazard — confirm its map layer disappears

### Hazard sync from Risk view

- on Risk view → Population Exposure, switch the hazard radio — confirm the matching hazard toggle in the Hazards section of the sidebar updates
- on Risk view → Infrastructure Risk, switch the hazard dropdown — confirm the matching hazard toggle in the sidebar updates

## Topography and CDD controls

### Topography (Exposure view)

- go to map page - Exposure view
- enable Topography in the sidebar
- switch between Elevation and Slope — confirm the map layer updates

### CDD (Risk view)

- go to map page - Risk view
- enable CDD in the sidebar
- switch between Absolute and Relative — confirm the map layer updates
