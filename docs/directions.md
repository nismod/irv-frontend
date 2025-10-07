# Current structure

Author: Maciej Ziarkowski

Last modified: 08 Jan 2023

Currently, the general sections of the source code are as follows. This list is
not exhaustive, it describes general contents of the directories, and some
individual files.

- `src/`
  - `config/` - contains the configuration and code related to the various
    datasets and visualisation layers, as well as other pieces of configuration.
    Most directories relate to an individual dataset / layer, or a group of
    related datasets / layers. Some exceptions are:
    - `assets/` - common functionality for "vector assets" - vector feature
      layers that can have damages data visualised on them
    - `damage-mapping/` - shared color scale for damage mapping
    - `basemaps.ts` - configuration of basemap styles
    - `interaction-groups.ts` - configuration of all the interaction groups
      available in the app
    - `map-view.ts` - configuration of the initial map view coordinates, zoom
      etc
    - `sources.ts` - functions to build URLs to access datasets in the
      vector/raster backends
    - `terracotta-color-map.ts` - querying Terracotta colormaps to build
      mappings from color to raster value
  - `details/` - UI and logic for displaying the selected feature details
  - `lib/` - library code which should be unrelated to the specific
    datasets/content of the app. **NOTE** there is an ESLint rule enforcing that
    files inside the `lib` folder cannot import code from any other folder in
    the project, to enforce the separation between generic and content-specific
    code
  - `map/` - UI, layout and behaviour of the main map view of the app. Contains
    also the code for displaying basemap selection, legend for current layers,
    tooltip for current hover
  - `modules/` - folder for large parts of the app (sub-apps) that can be
    isolated as completely separate modules. The modules should contain their
    own UI components, routes, data fetching etc
    - `downloads/` - code for the Extracts/Downloads tab
  - `pages/` - contents and layouts of the main pages of the app
  - `sidebar/` - the main layer selection sidebar
    - `sections/` - UI components for the controls displayed in various sidebar
      sections. Specific to the datasets displayed in the app.
    - `ui/` - components shared by the sidebar contents
    - `SidebarContent.tsx` - defining the overall contents of the sidebar
    - `url-state.tsx` - Recoil state synchronising the state of the sidebar
      sections to the URL
  - `state/` - Recoil state for the app
    - `data-domains/` - loading of parameter domains for the data layers
    - `data-selection/` - state used by layer selection sidebar
    - `layers/` - state which creates the view layer instances based on app
      state and data selection state
      - `data-layers/` - state of the layers pertaining to individual datasets
      - `ui-layers/` - special layers for UI (e.g. feature bounding box layer)
      - `interaction-groups.ts` - state containing all active interaction groups
      - `view-layers.ts` - state combining all active view layers
      - `view-layer-params.ts` - state setting up the dynamic view layer
        parameters
    - `map-view/` - map view state and syncing it to the URL
  - `api-client.ts` - singleton instances of API clients
  - `App.ts` - main React app component
  - `data-loader-manager.ts` - singleton instance of data loader manager
  - `index.css` - global styles (avoid, set styles in components instead)
  - `index.tsx` - Vite app entry point
  - `Nav.tsx` - main navigation component
  - `query-client.ts` - singleton instance of react-query client
  - `router.tsx` - base React app routes configuration
  - `theme.ts` - MUI theme configuration
  - `use-is-mobile.ts` - util hook
  - `vite-env.d.ts` - Vite types inclusion

## Introducing new concepts

This section introduces a few concepts that are currently not implemented
consistently in the app, but that could help organise the code in the future.

1. _Data module_ = the set of all code related to a single dataset (metadata,
   view layer definitions, UI details components etc)
2. _Slot_ - a standardised section of the UI that the app can define, and for
   which a view layer can provide code displaying React UI specific to that view
   layer. Example slots in the current app would be:
   - legend
   - tooltip
   - selection details

## Refactoring directions

Following are some general ideas of how the code base could be refactored over
time to provide better organisation.

1. All code related to a single data module, should be concentrated as much as
   possible in a single location
   - examples of how this is currently not the case:
     - `config/`
     - `state/`
       - `data-domains/`
       - `data-selection/`
       - `layers/data-layers/`
     - `sidebar/`
       - `sections/`

   - some thoughts:
     - the new location should be similar to the `config/` directory, though
       potentially renamed to something less generic (`data-modules`?), and
       separated from other types of non-data-module configuration
     - the data modules are fairly independent
     - there are some relationships between data modules that complicate the
       task - for example, damage mapping for infrastructure networks relies on
       hazard types

2. Make usage of formatting functions more consistent. Two approaches are
   currently used in different parts of the code:
   - the old approach uses functions such as `numFormat` (in `lib/helpers.ts`)
     - currently no way to tweak the formatting parameters, would need to create
       a completely new function
     - because of that, it has known issues such as that it limits the number of
       significant digits by default, which has lead in the past to some missed
       bugs such as rounded IDs etc
   - the new approach uses `makeValueFormat`, `nullFormat` (in `lib/formats.ts`)
     - has a simple but expressive parameters format:
       - first argument is either a string which will be parsed to replace `_`
         characters with the result of the number formatting (thus allowing to
         surround the formatted number with bits of text etc), or a function
         that accepts the formatted value and return a `ReactNode` (thus
         allowing for formatting numbers into HTML elements containing
         sub/superscript etc)
       - second argument is the standard `Intl.NumberFormatOptions` object which
         gives a broad range of built-in formatting capability
     - is a factory function that accepts all the format parameters, and returns
       a function that accepts just the value and returns the formatted value
     - easier to compose e.g. with `nullFormat`

3. Gather app-specific code in one place.
   - currently, the root `src/` folder contains several files and folders with
     app-specific React code:
     - `details/`
     - `map/`
     - `sidebar/`
     - `Nav.tsx`
   - organise these files/folders in a single place, so that they are clearly
     separated from higher-level folders such as `lib/`, `config/` etc

4. Refactor routing and pages folders to have more consistent organisation
5. Convert common interfaces such as `ViewLayer`, `InteractionGroup`, `ColorMap`
   etc to classes - currently, view layers are plain objects conforming to the
   `ViewLayer` interface. That means that a lot of code needs to know the
   internal structure of the view layer, rather than just calling simple methods
   to get the desired result.
   - the solution would be to create abstract base classes for these key
     components of the system, and let the application derive concrete
     implementations. For example, and `InteractionGroup` could have separate
     derived classes for raster interactions and for vector interactions.
   - one especially clear example of this is where `DataMap` gets all
     asynchronous data loaders for a given view layer. It results in complex
     code and the `DataMap` component needing to be aware of the internal logic
     of `ViewLayer`. Instead, the `ViewLayer` base class could have an abstract
     method called `getAllLoaders(...)` that would simply return a list of
     loaders, and the derived classes could implement the suitable logic to
     check if there are any loaders.

## Useful additions

1. Metadata class - most view layer definitions need to define some metadata
   which usually contains the definitions of some important aspects of the view
   layer
   - for example:
     - a list of string IDs representing some different variants of the data
       layer (e.g. `config/protected-areas/metadata.ts` lists `land` and
       `marine`)
     - human-readable labels for each key
     - colors for each key, to be used in the UI and map layers
     - an ordering of the variants, to be used for ordering UI controls, map
       layers, tooltip/legend contents etc
   - consider current usage in code of the following:
     - `toLabelLookup` function
     - `ValueLabel` type
     - `makeConfig` function
     - `makeColorConfig` function
   - the introduction of a helper class for working with the metadata, together
     with supporting TS helper types, could decrease the repetition and need to
     deal with built-in types like object or arrays, in a couple of ways:
     - enable defining most aspects of the metadata in one go:

       ```ts
       const [PROTECTED_AREA_TYPES, PROTECTED_AREA_META] = new Metadata(
         // a list of keys with a default ordering
         ['land', 'marine'],
         // dictionary of metadata values for the listed keys - missing/unknown keys should cause a TS error
         {
           land: {
             label: 'Terrestrial and Inland Waters',
             color: '#38A800',
           },
           marine: {
             label: 'Marine',
             color: '#004DA8',
           },
         },
       );

       // MetaKey is a special conditional type to get the union of all keys from a metadata class
       const ProtectedAreaType = MetaKey<typeof PROTECTED_AREA_META>;
       ```

       which defines the list of keys, the labels,

     - ideally, the class should allow for defining multiple instances of the
       labels/orderings etc - a `default` one, and potentially more for other
       use cases
       - consider that the most desirable ordering of different variants of a
         layer can be different for ordering UI controls in the sidebar (e.g.
         because there is a logical/semantic ordering that makes most sense) vs
         for the ordering of map layers (e.g. because some layers cover more
         land, and it's therefore better for them to be lower in the layer stack
         so as not to obscure the layers with less coverage)
       - in such cases, getting an ordering without a special key would return
         the default ordering:

       ```ts
       PROTECTED_AREA_META.defineOrdering('map', ['marine', 'land']);

       // ...

       // same as getOrdering('default')
       const defaultOrdering = PROTECTED_AREA_META.getOrdering();
       const mapOrdering = PROTECTED_AREA_META.getOrdering('map');
       ```

     - another useful feature would be to allow the deriving of new metadata
       sets from existing ones, by:
       - removing certain keys from the list of available keys
       - adding new keys (and defining the required metadata values for them)
       - combining two sets of metadata, provided that they share the required
         keys

       An example of a situation where this would be useful, is cases where a
       part of the app uses a list of variants from a certain view layer, plus
       one or more special values - for example sidebar controls for visualising
       damages from one of the hazard types, or `Total`
