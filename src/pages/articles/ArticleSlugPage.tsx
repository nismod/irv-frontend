import Typography from '@mui/material/Typography';
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
import { articleSlugs, getArticle } from './article-manifest';
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
  const article = slug ? getArticle(slug) : undefined;

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
};
