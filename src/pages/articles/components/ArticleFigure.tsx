import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FC, ReactNode } from 'react';

export interface ArticleFigureProps {
  /** Optional heading above the figure content. */
  title?: string;
  /** Explanatory text below the figure (caption). */
  caption?: ReactNode;
  children?: ReactNode;
  /** Max width of the figure block (default 50rem). */
  maxWidth?: string | number;
}

/**
 * Shared layout for embedded figures in articles: bordered block, optional title, interactive
 * content, optional caption. Nest `ArticleChart` or `ArticleMap` as children.
 */
export const ArticleFigure: FC<ArticleFigureProps> = ({
  title,
  caption,
  children,
  maxWidth = '50rem',
}) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      mt: 2,
      mb: 4,
      maxWidth,
      mx: 'auto',
      width: '100%',
      borderLeftWidth: 4,
      borderLeftColor: 'primary.main',
    }}
  >
    {title ? (
      <Typography variant="subtitle2" color="text.secondary" gutterBottom component="div">
        {title}
      </Typography>
    ) : null}
    <Box sx={{ '& p:last-child': { mb: 0 } }}>{children}</Box>
    {caption ? (
      <Typography variant="body2" color="text.secondary" sx={{ mt: title || children ? 1.5 : 0 }}>
        {caption}
      </Typography>
    ) : null}
  </Paper>
);
