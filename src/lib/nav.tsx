import { LinkProps, Button as MuiButton, Link as MuiLink } from '@mui/material';
import { ComponentProps } from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom';

import { Unrequired } from './helpers';
import { withProps } from './react/with-props';

export const ExtLink = ({ ...props }: Omit<LinkProps<'a'>, 'component'>) => {
  return <MuiLink target="_blank" rel="noopener noreferrer" {...props} />;
};

export const AppLink = withProps(MuiLink<typeof RouterLink>, {
  component: RouterLink,
});

export const AppLinkButton = withProps(MuiButton<typeof RouterLink>, {
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

/**
 * React-router scroll restoration which restores the scroll position
 * based on location.key (RR default), or location.pathname - based on
 * a pathBasedScroll variable stored in a route's [handle](https://reactrouter.com/en/main/route/route#handle)
 *
 * See more about RR's [ScrollRestoriation](https://reactrouter.com/en/main/components/scroll-restoration#getkey)
 */
export const CustomScrollRestoration = () => {
  return (
    <ScrollRestoration
      getKey={(location, matches) => {
        const lastMatch = matches[matches.length - 1];

        const { handle = {} } = lastMatch;
        const { pathBasedScroll = false } = handle as any;

        if (pathBasedScroll) {
          return location.pathname;
        } else {
          return location.key;
        }
      }}
    />
  );
};
