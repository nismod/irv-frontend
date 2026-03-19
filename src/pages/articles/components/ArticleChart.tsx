import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Callout } from './article-components';

interface ArticleChartProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Generic wrapper for charts embedded in articles.
 * Authors can wrap a chart component with this for consistent styling.
 */
export const ArticleChart = ({ title = 'Chart', description, children }: ArticleChartProps) => (
  <Callout title={title}>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {description}
      </Typography>
    )}
    <Box>{children}</Box>
  </Callout>
);
