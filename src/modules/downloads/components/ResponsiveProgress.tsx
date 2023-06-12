import { CircularProgress } from '@mui/material';

import { withProps } from '@/lib/react/with-props';

export const ResponsiveProgress = withProps(
  CircularProgress,
  {
    size: '1rem',
  },
  'ResponsiveProgress',
);
