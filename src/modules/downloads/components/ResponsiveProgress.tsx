import CircularProgress from '@mui/material/CircularProgress';

import { withProps } from '@/lib/react/with-props';

export const ResponsiveProgress = withProps(
  CircularProgress,
  {
    size: '1rem',
  },
  'ResponsiveProgress',
);
