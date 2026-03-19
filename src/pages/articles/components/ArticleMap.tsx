import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Callout } from './article-components';

interface ArticleMapProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Generic wrapper for map or spatial visualisations in articles.
 * For now this is purely presentational; concrete map implementations
 * can be passed as children.
 */
export const ArticleMap = ({ title = 'Map', description, children }: ArticleMapProps) => (
  <Callout title={title}>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {description}
      </Typography>
    )}
    <Box>{children}</Box>
  </Callout>
);
