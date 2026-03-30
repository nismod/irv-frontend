import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { ArticleMeta } from '@/content/articles/article-meta';
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

import { articleSlugs, loadAllArticles } from './article-manifest';

export const ArticlesIndexPage = () => {
  const [entries, setEntries] = useState<
    Array<{ slug: string; meta?: ArticleMeta; dateMs: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const allArticles = await loadAllArticles();

      const loaded = articleSlugs.map((slug) => {
        const meta = allArticles.get(slug)?.meta;
        const dateMs = meta?.date ? new Date(meta.date).getTime() : 0;
        return { slug, meta, dateMs };
      });

      loaded.sort((a, b) => b.dateMs - a.dateMs);

      if (!cancelled) {
        setEntries(loaded);
        setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

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
            {isLoading ? (
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Loading articles...
              </Typography>
            ) : (
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
            )}
          </ArticleParagraph>
        </ArticleSection>
      </ArticleContentContainer>
    </ArticleContainer>
  );
};
