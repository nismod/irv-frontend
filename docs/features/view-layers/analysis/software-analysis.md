# Software analysis

[Layers code analysis](./layers-code-analysis.md)

# Conclusions - general

The following are some thoughts that go beyond the topic of interactions / interaction groups.

The view layer config object handles things it maybe shouldn’t expect as present for all types of layers?

- selection state
- vector layer specific options:
  - styleParams
  - dataAccessFn
  - dataFormatsFn
- slots such as:
  - legend (with legend key mechanism)
  - tooltip
  - selection details

DataMap:

- props:
  - viewLayerParams - essentially view layer dynamic state (as opposed to params which are static after view layer creation)
    - currently the state contains selection value per layer
- mechanisms:
  - interactions
    - interaction groups, picking happens separately for each group
    - set Deck props: layerFilter, onHover, onClick, pickingRadius
  - data loaders
    - → could be replaced by some custom [deck.gl](http://deck.gl) Layer / Extension?

### Custom interactions vs vanilla deck.gl interactions

What are main functionalities that cannot be achieved with just setting vanilla [deck.gl](http://deck.gl) props on individual layers?

- more advanced picking
  - interaction groups, picking happens separately in each
  - sets global `Deck` component props: layerFilter, onHover, onClick, pickingRadius
- (potentially more?)

### Idea for React-based configuration

Could most layer-specific app state, and map configuration, be purely contained in the React sidebar?

The components inside the expandable sidebar sections could define the needed state, show the controls, but also render react-based view layer definitions based on the state. The view layers, including the map layers and other UI slots such as legend or tooltip, would be registered with central registries through a context-based mechanism.

This is too large of a change to implement now, but perhaps could be a goal to move towards in the future.

[React-based view layers sketch](https://www.notion.so/React-based-view-layers-sketch-1c3832028d8180b68846e11765b63107?pvs=21)
