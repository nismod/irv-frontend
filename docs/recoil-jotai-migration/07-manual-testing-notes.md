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
