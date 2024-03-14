# How To & Guide

Author: Maciej Ziarkowski

Last modified: 08 Jan 2023

## View Layers

A view layer is the central concept in the framework. A view layer represents
the visualisation of a dataset in the application, and bundles functionality for
both rendering the Deck.GL map layers, as well as rendering React components for
UI elements related to the layer, such as legend, hover tooltip, selected
feature details.

### Add a new view layer

1. Create a folder for the new dataset inside `config/`. For example,
   `config/industry/`
2. Define a helper method that will create a ViewLayer object, given some
   arguments (or no arguments)
3. Define the suitable layer selection state in `state/data-selection/` and use
   it in a suitable section of the `sidebar/SidebarContent.tsx`
4. Define the suitable view layer state in `state/layers/data-layers/` and add
   it at the right position to `state/layers/view-layers.ts`

NOTE: the framework does not define the structure for the code surrounding a
view layer definition. The main consideration is to avoid circular dependencies
between files, hence the frequent division into e.g. a `metadata.ts` file, a
view layer factory file, etc.

## Interaction Groups

Interaction groups are the main mechanism for handling map interactions in the
framework. An interaction group defines:

- the type of map interaction. Currently two types: vector (nearest feature,
  with tolerance defined by `pickingRadius`) or raster (pixel picking)
- whether multiple features or just one feature should be picked from the
  interaction group
- some other deck.gl-related interaction parameters such as picking radius

### Add a new interaction group

1. Define a new interaction group in `config/interaction-groups.ts`
2. Add the new interaction group to the active groups state in
   `state/layers/interaction-groups.ts`
3. If appropriate, add a tooltip section for the interaction group in
   `map/tooltip/TooltipContent.tsx`

## Data Map

The Data Map is the main component responsible for rendering an interactive data
visualisation map. It accepts a list of view layers, and a list of interaction
groups, and sets up the rendering and interaction settings based on that.

## App Structure

The following parts of the application structure are fairly independent and
their internal organisation should be possible to rework without significantly
modifying the other parts of the app:

- config/definitions of view layers (in `config/`)
- data/layer selection sidebar UI and its Recoil state (in `sidebar/` and
  `state/data-selection/`, `state/data-domains/`, `state/data-params.ts`)
- view layers Recoil state (`state/layers/`)
- `DataMap` library component together with the interaction state
- app components for the map view (`MapPage.tsx`, `MapView.tsx`)

with the following crucial dependencies / interactions:

- the view layers state depends on the data selection state which is manipulated
  by the sidebar UI, and builds the view layers state using view layer
  helpers/definitions from the `config`
- the `MapPage` component and its desktop/mobile layout components, assemble
  together all elements of the interactive map layout - sidebar, legend, feature
  selection sidebar, map HUD, the map itself
- the `MapView` fetches all the relevant Recoil state and passes it to the
  `DataMap` component as props. It also combines a `BaseMap`, `DataMap`, tooltip
  etc (these are all components that depend on the view state of the map)

NOTE that with the current setup, the `ViewLayer` objects are created inside
corresponding Recoil state in `state/layers/data-layers/`, and are therefore
recreated only when the dependencies of the state change. So the view layers are
not recreated on every frame, which helps with performance especially if the
view layer helper function contains some more time-consuming logic. The `fn`
method of each view layer (which produces a list of Deck.GL layers for the view
layer), on the other hand, will be called on every update to the map, for
example whenever the map view state changes (e.g. upon zooming). Therefore, any
time consuming calculations that don't depend on dynamically changing values
such as map view state or current selection, should be done once when the view
layer object is created - and not inside the `fn` method.
