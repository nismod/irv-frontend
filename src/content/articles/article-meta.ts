/**
 * Type for article frontmatter / meta.
 * Export `meta` from an MDX file to supply these fields.
 */
export interface ArticleMeta {
  title: string;
  /** Date in `YYYY-MM-DD` format. */
  date: string;
  /** Display name shown in the article byline next to the date. */
  author?: string;
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
export function defineArticleMeta(meta: ArticleMeta): ArticleMeta {
  return meta;
}

/**
 * Format `ArticleMeta.date` values (`YYYY-MM-DD`) for display in bylines.
 * Uses the local calendar date to avoid timezone shifts.
 */
export function formatArticleDate(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (
    y == null ||
    m == null ||
    d == null ||
    Number.isNaN(y) ||
    Number.isNaN(m) ||
    Number.isNaN(d)
  ) {
    return isoDate;
  }
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
