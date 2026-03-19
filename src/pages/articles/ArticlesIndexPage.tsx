import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import { ArticleContainer, ArticleContentContainer } from '@/pages/ui/ArticleContainer';
import { HeadingBox, HeadingBoxText } from '@/pages/ui/HeadingBox';

import { articleSlugs, getArticle } from './article-manifest';

export const ArticlesIndexPage = () => {
  const entries = articleSlugs.map((slug) => ({ slug, meta: getArticle(slug)?.meta }));

  return (
    <ArticleContainer>
      <HeadingBox>
        <HeadingBoxText>Articles</HeadingBoxText>
      </HeadingBox>
      <ArticleContentContainer>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Narrative articles and data-driven stories.
        </Typography>
        <List>
          {entries.map(({ slug, meta }) => (
            <ListItem key={slug} disablePadding>
              <ListItemButton component={Link} to={`/articles/${slug}`}>
                <ListItemText primary={meta?.title ?? slug} secondary={meta?.description} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ArticleContentContainer>
    </ArticleContainer>
  );
};
