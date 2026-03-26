import type { LoaderFunctionArgs } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { BackLink } from '@/lib/nav';

import {
  ArticleContainer,
  ArticleContentContainer,
  ArticleSection,
  NarrowContainer,
} from '@/pages/ui/ArticleContainer';
import { HeadingBox, HeadingBoxText } from '@/pages/ui/HeadingBox';

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

  return (
    <ArticleContainer>
      {meta?.title && (
        <HeadingBox>
          <HeadingBoxText>{meta.title}</HeadingBoxText>
        </HeadingBox>
      )}
      <ArticleContentContainer>
        <BackLink to="/articles">&larr; Back to articles</BackLink>
        <ArticleSection>
          <NarrowContainer>
            <Content components={articleMdxComponents} />
          </NarrowContainer>
        </ArticleSection>
      </ArticleContentContainer>
    </ArticleContainer>
  );
};
