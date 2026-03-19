import type { ArticleMeta } from '@/content/articles/article-meta';

type MdxModule = {
  default: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>;
  meta?: ArticleMeta;
};

const glob = import.meta.glob<MdxModule>('../../content/articles/*/article.mdx', { eager: true });

const entries = Object.entries(glob).map(([path, mod]) => {
  const slug = path.replace(/^.*\/([^/]+)\/article\.mdx$/, '$1');
  return { slug, module: mod };
});

export const articleSlugs: string[] = entries.map((e) => e.slug);

export function getArticle(slug: string): MdxModule | undefined {
  return entries.find((e) => e.slug === slug)?.module;
}
