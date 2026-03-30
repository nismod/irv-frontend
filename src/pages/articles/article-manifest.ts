import type { ArticleMeta } from '@/content/articles/article-meta';

type MdxModule = {
  default: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>;
  meta?: ArticleMeta;
};

const includeDevExamples = import.meta.env.DEV;

const productionGlob = import.meta.glob<MdxModule>('../../content/articles/*/article.mdx', {
  eager: true,
});

/** Slug folders under `_examples/` are bundled only in development. */
const devExamplesGlob = includeDevExamples
  ? import.meta.glob<MdxModule>('../../content/articles/_examples/*/article.mdx', { eager: true })
  : ({} as Record<string, MdxModule>);

function entriesFromGlob(globResult: Record<string, MdxModule>) {
  return Object.entries(globResult).map(([path, mod]) => {
    const slug = path.replace(/^.*\/([^/]+)\/article\.mdx$/, '$1');
    return { slug, module: mod };
  });
}

const entries = [...entriesFromGlob(productionGlob), ...entriesFromGlob(devExamplesGlob)];

export const articleSlugs: string[] = entries.map((e) => e.slug);

export function getArticle(slug: string): MdxModule | undefined {
  return entries.find((e) => e.slug === slug)?.module;
}
