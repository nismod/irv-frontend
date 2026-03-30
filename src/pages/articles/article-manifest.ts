import type { ArticleMeta } from '@/content/articles/article-meta';

type MdxModule = {
  default: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>;
  meta?: ArticleMeta;
};

const includeDevExamples = import.meta.env.DEV;

// Important: do NOT use `eager: true` here, otherwise all article chunks get bundled into the main
// JS chunk and lazy-loading is impossible.
const productionGlob = import.meta.glob<MdxModule>('../../content/articles/*/article.mdx');

/** Slug folders under `_examples/` are bundled only in development. */
const devExamplesGlob = includeDevExamples
  ? import.meta.glob<MdxModule>('../../content/articles/_examples/*/article.mdx')
  : ({} as Record<string, () => Promise<MdxModule>>);

function entriesFromGlob(globResult: Record<string, () => Promise<MdxModule>>) {
  return Object.entries(globResult).map(([path, importer]) => {
    const slug = path.replace(/^.*\/([^/]+)\/article\.mdx$/, '$1');
    return { slug, importer };
  });
}

const entries = [...entriesFromGlob(productionGlob), ...entriesFromGlob(devExamplesGlob)];

const importerBySlug = new Map<string, () => Promise<MdxModule>>(
  entries.map(({ slug, importer }) => [slug, importer]),
);

export const articleSlugs: string[] = Array.from(importerBySlug.keys());

type ArticleMap = Map<string, MdxModule>;
let allArticlesPromise: Promise<ArticleMap> | null = null;

/**
 * Loads all article MDX modules exactly once (cached promise).
 * This intentionally shifts the cost to the first visit of `/articles`
 * or the first visit of any article slug.
 */
export async function loadAllArticles(): Promise<ArticleMap> {
  if (allArticlesPromise) return allArticlesPromise;

  allArticlesPromise = Promise.all(
    entries.map(async ({ slug, importer }) => {
      const mod = await importer();
      return [slug, mod] as const;
    }),
  ).then((pairs) => new Map(pairs));

  return allArticlesPromise;
}

export async function loadArticle(slug: string): Promise<MdxModule | undefined> {
  const all = await loadAllArticles();
  return all.get(slug);
}
