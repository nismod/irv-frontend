# Comments

Author: Maciej Ziarkowski

Last modified: 08 Jan 2023

This document lists some loose thoughts on potential small improvements, noted
down while adding comments to the source code.

```
/src
    /lib
        /controls
            /accordion-toggle
                ToggleSection.tsx
                    - all code unused!
            /checkbox-tree
                CheckboxTree.tsx
                    - unnecessary `nodes` prop if already contained in `config`
                tree-node.ts
                    - TreeNode <T> should extend object
            /params
                ParamChecklist.tsx
                value-label.ts
                    - move to separate lib subfolder
            data-params.ts
                - move to its own lib subfolder
                - split basic types, resolving dependencies, inferring dependencies from data
        /data-loader
            data-loader.ts
            data-loader-manager.ts
                - generalise away from layer/fieldSpec
                - generalise away from apiClient (loading method)
        /data-map
            /legend

            color-maps.ts
                - move to a folder for d3 scales
            view-layers.ts
                - separate vector and raster layer specific code
        /deck
            /props
                style.ts
                    - idea: switch point/line scale units from 0, 1, 2... to l, m, s, xl, xs, xxl, xxs etc (clearer meaning and easier to add even larger/smaller sizes)
                getters.ts
                    - clean up and document withTriggers, withLoaderTriggers etc - inconsistent parameter structure, potentially dangerous dropping of loaders/triggers
```

Larger changes:

- change ViewLayer to class
- use interaction groups directly as objects rather than referring to them as
  IDs
- make usage of format function consistent
  - e.g. feature IDs for infrastructure are formatted with `numFormat`, losing
    precision
