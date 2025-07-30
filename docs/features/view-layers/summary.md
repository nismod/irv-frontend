# Summary of new view layer interface work

This document summarises the current state of the work on the new view layer interface.
The design work here was preceded by an analysis of how the current configuration of the GRI Risk Viewer uses the old version of the view layers mechanism. The analysis is included under [Software Analysis](./analysis/software-analysis.md) (summary) and [Layers Code Analysis](./analysis/layers-code-analysis.md) (detailed analysis).

Main goals of the work:

1. Design a new view layer interface where:

   1. Each view layer renders a map representation (one or more deck.gl layers), and it can also define React-based UI "slots" representing the view layer in non-map contexts.
   1. Each view layer defines its map interactions (rather than only defining an interaction group ID)
   1. Each view layer has its own custom state, which can be read and modified from:

      - the layer rendering code
      - the layer map interactions code
      - the React "slots" of the layer

1. Provide a way of gradually transitioning between the old and the new system

## New view layer interface

The design for the new view layer interface encompasses the following features (described in more detail in sections below):

- new map layer rendering interface
- new map interactions interface
- unified React "slots" interface
- new view layer state mechanism, integrated into the above functions

### New map interactions

This part of the work is at the stage of sketching out. The need for a new way of defining map interactions is based on the research described in [Software Analysis](./analysis/software-analysis.md)

To sum up the conclusions from that analysis: the old mechanism allows view layer definitions to specify (by ID) a single interaction group that the layer will belong to. The interaction group defines both the interaction style (vector, raster pixel picking etc), as well as the "conflict group" (which other layers the layer will "compete" for interaction events with).
The interaction state (selection, hover) is stored globally per interaction group. The UI slots such as tooltip or selection details are based on querying the interaction state for a specific interaction group.

The work in progress code contains some sketches of how the interface could look:

```ts
export function industryViewLayer(
  industryType: IndustryType,
): ViewLayer<IndustryParams, IndustryState> {
  // ...

  return {
    type: 'new',
    id: industryType,
    params: {
      industryType,
    },
    interactions: new VectorInteractions({
      group: 'assets',
    }),

    // ...
  };
}
```

In this sketch, the `interactions` property is an object complying to some interface (e.g. `ViewLayerInteractions`), where different concrete classes (e.g. `VectorInteractions`) can define different types of map interactions. Mechanisms such as conflict groups could be implemented through properties of the concrete class constructors. This needs more design work.

Another issue to still resolve is whether the interactions should be specified on the view layer level, or perhaps on the deck layer level. Some view layers might return a list of deck layers rather than a single layer, and only some of these should be interactive, while others might be purely presentational and not interactive (e.g. a view layer returning a polygons layer and a labels layer). In the new design (as well as in the current framework) the interactions are specified for the whole view layer.
This issue is related to the question about whether the required features could be achieved by extending the built-in interactions handling of deck.gl. As described in [Software Analysis](./analysis/software-analysis.md#custom-interactions-vs-vanilla-deckgl-interactions), it seems that a mechanism that goes beyond deck.gl layer interaction event handlers is needed after all.

### View layer slots

The old style view layers define functions to render layer-related React components in the applications, specifically the functions `renderLegend`, `renderTooltip` and `renderDetails`. However, the list of these specific locations in the React tree shouldn't really be specified in the generic interface for the view layers framework.
A better solution is for the application programmer to be able to define what slots should be possible to define in the application. In the new approach this is achieved through the Typescript mechanism of _module augmentation_ / _declaration merging_:

The base framework defines a type for a view layer's slots:

```ts
/**
 * Helper interface to register a slot with no props
 */
export interface NoProps {}

/**
 * Augment this interface in app code to register known slots.
 *
 * Keys should be the names of slots. Values should be the props type of each slot.
 *
 */
export interface KnownViewLayerSlots {
  // slots need to be registered by app code
}

export interface ViewLayerNew<ParamsT extends object = any, StateT extends object = any> {
  // ...

  slots: {
    [key in keyof KnownViewLayerSlots]: React.ComponentType<KnownViewLayerSlots[key]>;
  };
}
```

By default, the `KnownViewLayerSlots` interface is empty, so view layer definitions cannot add any slot components.

In an example use case where the application has a layer tooltip slot in the UI, the `Tooltip` slot should be defined somewhere in the project. The location of this augmentation is not strictly prescribed, it should be located somewhere that makes sense.

E.g. in `src/map/tooltip/TooltipContent.tsx`:

```ts
declare module '@/lib/data-map/view-layers' {
  interface KnownViewLayerSlots {
    Tooltip?: NoProps;
  }
}
```

Then, in layer definitions, a `Tooltip` slot can be defined:

E.g. in `config/industry/industry-view-layer.tsx`:

```ts
export function industryViewLayer(
  industryType: IndustryType,
): ViewLayer<IndustryParams, IndustryState> {

  // prepare view layer parameters etc
  // ...

  // return the view layer object
  return {
    type: 'new',

    // ...

    slots: {
      Tooltip: () => {
         // access layer state here if needed, check if the slot for this layer should be rendered etc
         // ...

         return (
            // return some React representation of the layer in the tooltip
            // ...
         );
      },
    },
  };
}
```

Then, in application code, the programmer should instantiate the location of the slot.

The precise way of instantiating the slot is TBD - perhaps the layers should be iterated over manually like this:

```ts
{newLayers.map((layer) => (
   <Suspense key={layer.id} fallback={<TooltipLoading />}>
      <ViewLayerSlot slot="Tooltip" slotProps={{}} viewLayer={layer} />
   </Suspense>
))}
```

The `ViewLayerSlot` component above is part of the framework and should be implemented so that the slot definition for the layer gets access to the view layer's state. See `src/lib/data-map/ViewLayerSlot.tsx` for a sketch.

To sum up, the application programmer interacts with the mechanism of slots in three places:

- specifying that layers can define a slot under a certain name
- writing definitions of how each layer should render that slot, based on layer state (not all layers need to have a definition for that slot)
- specifying a place in the global application code where the rendering of that slot will be done

### View layer state

The key is that the view layers have state that is shared (can be read and modified) by both the deck.gl map layer definitions (map rendering / map interactions), and the React slots for the view layer.

The management of the state lifecycle and exposing the state value and state writing functions have to be handled by the framework.

Some sketches of related files:

- `src/lib/data-map/react/view-layer-state.tsx`
- `src/lib/data-map/react/ViewLayerContextProvider.tsx`
- `src/lib/data-map/ViewLayerSlot.tsx`

## A migration path with old/new style view layer

In order to gradually migrate towards the new model of view layers, a distinction between `old` and `new`-type layers can be introduced.
Initially, only some layers can then be reworked as the new type.

```ts
/**
 * Renamed from `ViewLayer`
 * */
export interface ViewLayerOld<ParamsT extends object = any> {
  type: 'old';

  // ...
}

export interface ViewLayerNew<ParamsT extends object = any, StateT extends object = any> {
  type: 'new';
  // ...
}

export type ViewLayer<ParamsT extends object = any, StateT extends object = any> =
  | ViewLayerOld<ParamsT>
  | ViewLayerNew<ParamsT, StateT>;
```

The framework code then needs to handle both types of layers passed into the framework.
Some examples of work started on this are located in:

- `src/lib/data-map/DataMap.tsx`
- `src/map/legend/MapLegend.tsx`
