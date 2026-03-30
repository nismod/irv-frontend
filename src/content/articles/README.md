# Article content (MDX)

Narrative articles are written in **MDX** (markdown + JSX) and live in a **one-folder-per-article** layout.
Each folder becomes a route at `/articles/<slug>`, where `<slug>` is the folder name.

### Production vs dev-only articles

- **`src/content/articles/<slug>/`** – Included in **all** builds and listed on `/articles`.
- **`src/content/articles/_examples/<slug>/`** – Bundled and listed **only when `import.meta.env.DEV` is true** (local `vite` dev server). Example and demo articles can live here so they stay in the repo but do not appear on the production site.

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

Use the same layout under `_examples/<slug>/` for dev-only articles.

## `article.mdx` structure

- **Meta:** Export a `meta` object for title, date, optional author, and description. Import `defineArticleMeta` from `@/content/articles/article-meta` when you want typed `meta` in MDX:

  ```mdx
  export const meta = {
    title: 'Article title',
    description: 'Short summary',
    date: '2025-03-15',
    author: 'Display name',
  };
  ```

  The article page shows the **date** and **author** in a byline under the title in the header band.

- **Body:** Standard markdown plus any embedded components.
  - Generic components are available in MDX automatically via the MDX component map.
  - Article-specific components can be added by importing local TSX files from the same folder.

## Embedded components (available without importing)

The article layout injects a set of components so authors can use them by name without importing.
Current built-ins:

- **`<Callout title="...">`** – Styled note/callout box.
- **`<ArticleFigure title="..." caption="...">`** – Shared layout for embedded figures (bordered block, optional title and caption). Nest `ArticleChart` or `ArticleMap` as children.
- **`<ArticleChart />`** – Vega-Lite chart (`spec`, `data`, optional `options`); use inside `ArticleFigure`.
- **`<ArticleMap />`** – Interactive data map (`viewLayers`, optional `interactionGroups`, `height`, etc.); use inside `ArticleFigure`. Children (e.g. `MapMarker`) render inside the map.
- **`<MapMarker />`** – Map pin / popup for use as a child of `ArticleMap`.
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
