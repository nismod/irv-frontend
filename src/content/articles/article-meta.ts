/**
 * Type for article frontmatter / meta.
 * Export `meta` from an MDX file to supply these fields.
 */
export interface ArticleMeta {
  title: string;
  description?: string;
  date?: string;
}
