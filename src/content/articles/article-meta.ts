/**
 * Type for article frontmatter / meta.
 * Export `meta` from an MDX file to supply these fields.
 */
export interface ArticleMeta {
  title: string;
  date: string;
  description?: string;
  /**
   * Optional URL for an article thumbnail to display on the articles index.
   * Typically a public asset path like `/card-hazard.png` or a Vite-imported URL.
   */
  thumbnail?: string;
}

/**
 * Helper to get proper typing for `meta` exports inside MDX.
 *
 * In MDX we avoid TypeScript-only syntax (like `satisfies` and `import type`)
 * because the current MDX parser setup can be strict.
 */
export function defineArticleMeta<const T extends ArticleMeta>(meta: T): T {
  return meta;
}
