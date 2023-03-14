import { Link as MuiLink } from '@mui/material';
import { ComponentProps } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink, useLocation } from 'react-router-dom';

import { Unrequired } from './helpers';
import { withProps } from './react/with-props';

export const AppLink = withProps(MuiLink<typeof RouterLink>, {
  component: RouterLink,
});

export const AppNavLink = withProps(MuiLink<typeof RouterNavLink>, {
  component: RouterNavLink,
});

export const BackLink = (props: Unrequired<ComponentProps<typeof AppLink>, 'to'>) => {
  const { state } = useLocation();
  const { from = '..' } = state ?? {};

  return <AppLink to={from} {...props} />;
};
