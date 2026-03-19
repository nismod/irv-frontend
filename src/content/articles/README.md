# Article content (MDX)

Narrative articles are written in **MDX** (markdown + JSX). Each file in this directory becomes a route at `/articles/<filename-without-extension>`.

## File structure

- **Meta (optional):** Export a `meta` object for title, description, and date:

  ```mdx
  export const meta = {
    title: 'Article title',
    description: 'Short summary',
    date: '2025-03-15',
  };
  ```

- **Body:** Standard markdown plus any [embedded components](#embedded-components) (e.g. `<Callout>`, future charts or maps).

## Embedded components

The article layout injects a set of components so authors can use them by name without importing. Current components:

- **`<Callout title="...">`** – Styled note/callout box.

To add more (e.g. charts, data visualisations, app embeds): extend `articleMdxComponents` in `src/pages/articles/article-components.tsx` and use the new name in MDX.
