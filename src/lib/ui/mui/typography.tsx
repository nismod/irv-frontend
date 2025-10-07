import Typography from '@mui/material/Typography';

import { withProps } from '../../react/with-props';

export const H1 = withProps(Typography, { variant: 'h1' }, 'H1');
export const H2 = withProps(Typography, { variant: 'h2' }, 'H2');
export const H3 = withProps(Typography, { variant: 'h3' }, 'H3');
export const H4 = withProps(Typography, { variant: 'h4' }, 'H4');
export const H5 = withProps(Typography, { variant: 'h5' }, 'H5');
export const H6 = withProps(Typography, { variant: 'h6' }, 'H6');
