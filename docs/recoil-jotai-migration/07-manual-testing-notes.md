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
