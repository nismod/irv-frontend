# Article content (MDX)

Narrative articles are written in **MDX** (markdown + JSX) and live in a **one-folder-per-article** layout.
Each folder inside this directory becomes a route at `/articles/<slug>`, where `<slug>` is the folder name.

## Folder structure

Each article folder should follow this structure:

```txt
src/content/articles/<slug>/
  article.mdx
  # optional co-located assets (example):
  data.json
  dataset.csv
  VegaBarChart.tsx
  thumbnail.png # optional: used by meta.thumbnail
```

## `article.mdx` structure

- **Meta (optional):** Export a `meta` object for title, description, and date:

  ```mdx
  export const meta = {
    title: 'Article title',
    description: 'Short summary',
    date: '2025-03-15',
  };
  ```

- **Body:** Standard markdown plus any embedded components.
  - Generic components are available in MDX automatically via the MDX component map.
  - Article-specific components can be added by importing local TSX files from the same folder.

## Embedded components (available without importing)

The article layout injects a set of components so authors can use them by name without importing.
Current built-ins:

- **`<Callout title="...">`** – Styled note/callout box.
- **`<ArticleChart />`** – Presentational wrapper for charts.
- **`<ArticleMap />`** – Presentational wrapper for maps/spatial visualisations.
- **Heading components**: `<h1>` ... `<h6>` and link rendering via the MDX component map.

To add more auto-available components (e.g. charts, embeds): extend `articleMdxComponents` in
`src/pages/articles/components/article-components.tsx`, then use the new component name directly in MDX.

## Thumbnails

If you want an image on the `/articles` index next to each article, set:

```mdx
import thumbnail from './thumbnail.png';

export const meta = defineArticleMeta({
  title: '...',
  description: '...',
  thumbnail,
});
```
