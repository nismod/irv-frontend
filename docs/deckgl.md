# Deck.gl

Author: Maciej Ziarkowski

Last modified: 08 Jan 2023

## Introduction

This project uses deck.gl as the main spatial data visualisation library.

Deck.gl is a relatively low-level framework that is essentially a 3D rendering
engine optimised for displaying large geospatial data in realtime (though it can
be used to visualise other types of data).

Because of its low level nature, deck.gl gives a lot of freedom in how the data
is visualised, but it also leaves a lot of typical spatial data application
features to be implemented from scratch by the user of the library.

This project implements several mechanisms to enable using deck.gl with less low
level code and more ability to package bits of functionality.

## Rationale

The typical approach of configuring a deck.gl application is to use the built-in
(or third-party) layer classes and supply the right props to them. If more
advanced customisation is required, the programmer can use inheritance and
create new layers derived from existing layers.

An additional possibility is to define layer extensions, which package
functionality that can be injected into layers.

However, both layers and layer extensions are relatively low-level constructs.
Their interfaces revolve around deck.gl's rendering and interaction mechanisms.

In the SRAT tool so far, all of the datasets can be visualised using one of a
short list of built-in layer types:

- `GeoJsonLayer` or its tiled version - `MVTLayer`
- `TileLayer` with each tile rendered as a `RasterLayer` (essentially a raster
  tile layer)

However, the variety of datasets necessitates sometimes very different prop
configurations for the basic layers. The deck.gl approach doesn't lend itself
easily to packaging functionality in such a way where a set of distinct
"behaviors", packaged as separate sets of props, is passed to the layer.

This is because one of the crucial mechanisms in more complex deck.gl apps is
usage of compounds props such as `updateTriggers`, `extensions`,
`renderSubLayers` etc.

`updateTriggers` (see deck.gl docs for more info about this prop) is an object
whose keys correspond to other props passed to the object, and define when those
props should be re-computed (for function-valued props, this **does not** happen
on every frame). When `updateTriggers` is passed to a layer a few times, only
the last value will be taken, overwriting the older values.

This prevents the packaging of behaviors where more than one behavior relies on
`updateTriggers`, `extensions` etc. This is why this framework introduces a
modified and extended version of working with props in deck.gl.

## Deck.gl prop merging behavior

The raw deck.gl layers have been wrapped in functions that add advanced
capabilities to the layers:

1. the list of props objects now has similar semantics to how deck.gl layers are
   preprocessed - nested arrays of prop objects are flattened, falsy values are
   ignored.
2. the flattened and filtered list of props objects is merged according to
   updated semantics:

- in vanilla deck.gl: props are merged with `Object.assign()` semantics (upon
  prop name collisions, the prop value that occurs later overrides the earlier
  value)
- in the enhanced version: the app specifies custom merging logic for specific
  properties that shouldn't be simply overwritten (see below)

### Custom merge strategies

The custom merge strategies are defined in `lib/deck/layers/base.ts`.

The app currently defines custom merge strategies for the following deck.gl
props:

- `updateTriggers` - when multiple prop objects supply `updateTriggers`, the
  objects are merged instead of overwritten

  For example:

```ts
{
  updateTriggers: {
    getColor: [1];
  }
}
```

and

```ts
{
  updateTriggers: {
    getPointRadius: [2, 'asf'];
  }
}
```

will become

```ts
{
  updateTriggers: {
    getColor: [1],
    getPointRadius: [2, 'asf']
  }
}
```

**BUT** if keys of `updateTriggers` repeat, the values are overwritten. This
makes more sense than merging the inner values, because it aligns with how other
props outside of `updateTriggers` are overwritten by default. For example:

Merging

```ts
{
  lineWidthMaxPixels: 2,
  getColor: (x) => x.properties[colorField],
  updateTriggers: {
    getColor: [colorField]
  }
}
```

and

```ts
{
  lineWidthMinPixels: 1,
  getColor: (x) => x.properties[anotherColorField],
  updateTriggers: {
    getColor: [anotherColorField]
  }
}
```

will yield

```ts
{
  lineWidthMaxPixels: 2,
  lineWidthMinPixels: 1,
  getColor: (x) => x.properties[anotherColorField],
  updateTriggers: {
    getColor: [anotherColorField]
  }
}
```

- `updateTriggers.renderSubLayers` is an exception - the arrays are merged by
  concatenating the individual arrays. This is related to how the
  `renderSubLayers` prop itself is merged in a special way (see below)

- `extensions` arrays are concatenated
- `renderSubLayers` are functions that return an array of deck layers. So they
  are merged in a special way where each function will be called with the
  arguments passed from deck.gl, and then the results of each function are
  placed into one nested array of layers. The order in which the individual
  instances of `renderSubLayers` appear in the props, will determine the order
  of layers in the merged array.
