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

### Hazards section param dropdowns

- go to `/view/exposure`
- expand each hazard control once (Fluvial, Coastal, Cyclone, CDD, Extreme Heat, Drought, Landslide, Earthquake)
- for each: confirm every param dropdown (epoch / RCP / SSP / GCM / return period / trigger, where applicable) is populated with values
- in one hazard, change RCP and confirm Epoch / return period dropdowns reflow correctly (some combinations disappear or change)

### Infrastructure risk section

- go to `/view/risk`, open Infrastructure Risk
- toggle the sector dropdown (Roads / Rail / Power) — confirm the hazard dropdown options reflow accordingly (Power → Cyclone only, etc.)
- switch the hazard and confirm the map damage layer updates

### Damages drill-down (right-hand asset panel)

- on `/view/risk`, turn on Infrastructure Risk and ensure a sector layer is visible on the map
- zoom in and click an asset (e.g. a road segment)
- confirm the right-hand "Asset details" panel renders the Expected Annual Damages section and Return Period Damages section
- confirm the hazard / epoch / return-period dropdowns are populated
- change hazard, epoch, and return period filters; confirm the charts and tables update accordingly
- click "Download CSV" on each section; confirm a CSV file is downloaded with the expected columns
- click a different asset and confirm the panel re-renders with the new feature's data
- deselect (click the deselect button or click empty map area) and confirm the panel closes
