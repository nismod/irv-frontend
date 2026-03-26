import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import {
  ArticleContainer,
  ArticleContentContainer,
  ArticleParagraph,
  ArticleSection,
  EmphasisTextContainer,
  EmphasisTextParagraph,
  MiniBar,
} from '@/pages/ui/ArticleContainer';
import { HeadingBox, HeadingBoxText } from '@/pages/ui/HeadingBox';

import { articleSlugs, getArticle } from './article-manifest';

export const ArticlesIndexPage = () => {
  const entries = useMemo(
    () =>
      articleSlugs
        .map((slug) => ({
          slug,
          meta: getArticle(slug)?.meta,
          date: new Date(getArticle(slug)?.meta?.date ?? ''),
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    [],
  );

  return (
    <ArticleContainer>
      <HeadingBox>
        <HeadingBoxText>Articles</HeadingBoxText>
      </HeadingBox>
      <ArticleContentContainer>
        <ArticleSection>
          <EmphasisTextContainer>
            <MiniBar />
            <EmphasisTextParagraph>
              Explore narrative articles and data-driven stories.
            </EmphasisTextParagraph>
          </EmphasisTextContainer>
          <ArticleParagraph>
            <List>
              {entries.map(({ slug, meta }) => (
                <ListItem key={slug} disablePadding>
                  <ListItemButton component={Link} to={`/articles/${slug}`}>
                    {meta?.thumbnail ? (
                      <Box
                        component="img"
                        src={meta.thumbnail}
                        alt={meta.title}
                        sx={{
                          width: '64px',
                          height: '64px',
                          objectFit: 'cover',
                          mr: 2,
                          borderRadius: '6px',
                          flex: '0 0 auto',
                        }}
                      />
                    ) : null}
                    <ListItemText primary={meta?.title ?? slug} secondary={meta?.description} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </ArticleParagraph>
        </ArticleSection>
      </ArticleContentContainer>
    </ArticleContainer>
  );
};
