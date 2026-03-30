import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { BackLink } from '@/lib/nav';

import { formatArticleDate } from '@/content/articles/article-meta';
import {
  ArticleContainer,
  ArticleContentContainer,
  ArticleSection,
  NarrowContainer,
} from '@/pages/ui/ArticleContainer';
import { HeadingBox, HeadingBoxText } from '@/pages/ui/HeadingBox';

import { BackToTop } from '../ui/BackToTop';
import { articleSlugs, loadArticle } from './article-manifest';
import { articleMdxComponents } from './components/article-components';

export function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug || !articleSlugs.includes(slug)) {
    throw new Response(null, { status: 404, statusText: 'Article not found' });
  }
  return { slug };
}

export const ArticleSlugPage = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return null;

  // Remount on `slug` change so we don't need to synchronously clear state in an effect.
  return <ArticleSlugPageContent key={slug} slug={slug} />;
};

function ArticleSlugPageContent({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Awaited<ReturnType<typeof loadArticle>> | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadArticle(slug)
      .then((mod) => {
        if (!cancelled) setArticle(mod);
      })
      .catch(() => {
        if (!cancelled) setArticle(undefined);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (article === null) return null; // loading
  if (!article) return null; // loader guarantees slug exists

  const Content = article.default;
  const meta = article.meta;

  const bylineParts: string[] = [];
  if (meta?.date) {
    bylineParts.push(formatArticleDate(meta.date));
  }
  if (meta?.author) {
    bylineParts.push(meta.author);
  }
  const byline = bylineParts.length > 0 ? bylineParts.join(' · ') : null;

  return (
    <ArticleContainer>
      {meta?.title && (
        <HeadingBox>
          <BackLink
            to="/articles"
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.92)',
              display: 'inline-block',
              mb: 1.5,
              textDecoration: 'none',
              maxWidth: '50rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            &larr; Back to articles
          </BackLink>
          <HeadingBoxText>{meta.title}</HeadingBoxText>
          {byline ? (
            <Typography
              variant="subtitle1"
              component="p"
              sx={{ mt: 2, opacity: 0.92, fontWeight: 400, maxWidth: '50rem' }}
            >
              {byline}
            </Typography>
          ) : null}
        </HeadingBox>
      )}
      <ArticleContentContainer>
        <ArticleSection>
          <NarrowContainer>
            <Content components={articleMdxComponents} />
          </NarrowContainer>
        </ArticleSection>
        <BackToTop id="end" />
      </ArticleContentContainer>
    </ArticleContainer>
  );
}
