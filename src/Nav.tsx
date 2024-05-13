import Close from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link, { LinkProps } from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { FC, forwardRef, useCallback, useState } from 'react';
import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from 'react-router-dom';

import { useIsMobile } from './use-is-mobile';

const BaseLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
}) as typeof Link;

const DrawerLink = styled(BaseLink)({
  color: '#ffffff',
  '&:hover,&:focus': {
    backgroundColor: '#213621',
  },
  '&:active,&.active': {
    backgroundColor: '#213621',
  },
}) as typeof BaseLink;

const ToolbarLink = styled(BaseLink)({
  padding: '0 0 1px 0',
  margin: '0 9px -10px 9px',
  whiteSpace: 'nowrap',
  textOverflow: 'clip',
  borderBottom: '6px solid transparent',
  '&:hover,&:focus': {
    borderBottomColor: '#ffffff',
  },
  '&:active,&.active': {
    borderBottomColor: '#ffffff',
  },
}) as typeof BaseLink;

const ToolbarNavLink = forwardRef<HTMLAnchorElement, RouterNavLinkProps & Partial<LinkProps>>(
  (others, ref) => <ToolbarLink variant="h6" component={RouterNavLink} ref={ref} {...others} />,
);

const ToolbarNavLinkSecondary = forwardRef<
  HTMLAnchorElement,
  RouterNavLinkProps & Partial<LinkProps>
>((others, ref) => (
  <ToolbarLink
    variant="h6"
    sx={{ fontWeight: 400, fontSize: '1.3rem' }}
    component={RouterNavLink}
    ref={ref}
    {...others}
  />
));

const DrawerNavLink = forwardRef<HTMLAnchorElement, RouterNavLinkProps & Partial<LinkProps>>(
  (others, ref) => <DrawerLink variant="h6" component={RouterNavLink} ref={ref} {...others} />,
);

const GrowingDivider = styled(Divider)({
  flexGrow: 1,
});

const navItems = [
  {
    to: '/view/hazard',
    title: 'Hazard',
  },
  {
    to: '/view/exposure',
    title: 'Exposure',
  },
  {
    to: '/view/vulnerability',
    title: 'Vulnerability',
  },
  {
    to: '/view/risk',
    title: 'Risk',
  },
  {
    to: '/view/adaptation',
    title: 'Adaptation',
  },
  {
    to: '/metrics',
    title: 'Metrics',
  },
];
const secondaryNavItems = [
  {
    to: '/about',
    title: 'About',
  },
  {
    to: '/guide',
    title: 'Guide',
  },
  {
    to: '/data',
    title: 'Sources',
  },
  {
    to: '/downloads',
    title: 'Downloads',
  },
];

const drawerWidth = 360;

const MobileDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: 'rgb(23,38,23)',
  },
});

const MobileNavContent: FC<{ height: number }> = ({ height }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={() => setDrawerOpen((open) => !open)} title="Menu">
        {drawerOpen ? <Close /> : <Menu />}
      </IconButton>

      <ToolbarNavLink to="/" onClick={closeDrawer}>
        GRI Risk Viewer
      </ToolbarNavLink>

      <GrowingDivider />

      <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
        {/* Margin prevents app bar from concealing content*/}
        <List sx={{ marginTop: height + 'px', padding: 0 }}>
          <ListItem component={DrawerNavLink} to="/" onClick={closeDrawer}>
            Home
          </ListItem>
          {navItems.map(({ to, title }) => (
            <ListItem key={to} component={DrawerNavLink} to={to} onClick={closeDrawer}>
              {title}
            </ListItem>
          ))}
        </List>
        <List sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.4)', padding: 0 }}>
          {secondaryNavItems.map(({ to, title }) => (
            <ListItem key={to} component={DrawerNavLink} to={to} onClick={closeDrawer}>
              {title}
            </ListItem>
          ))}
        </List>
      </MobileDrawer>
    </>
  );
};

const DesktopNavContent = () => (
  <>
    <ToolbarNavLink to="/">GRI Risk Viewer</ToolbarNavLink>

    {navItems.map(({ to, title }) => (
      <ToolbarNavLink key={to} to={to}>
        {title}
      </ToolbarNavLink>
    ))}

    <GrowingDivider />

    {secondaryNavItems.map(({ to, title }) => (
      <ToolbarNavLinkSecondary key={to} to={to}>
        {title}
      </ToolbarNavLinkSecondary>
    ))}
  </>
);

const topStripeHeight = 6;

export const Nav: FC<{ height: number }> = ({ height }) => {
  const isMobile = useIsMobile();

  return (
    <AppBar position="fixed" elevation={0} sx={{ color: 'white' }}>
      <Toolbar
        variant="dense"
        sx={{
          borderTopColor: 'rgb(142,193,85)',
          borderTopWidth: topStripeHeight,
          borderTopStyle: 'solid',
          backgroundColor: 'rgb(23,38,23)',
          height: height,
        }}
      >
        {isMobile ? <MobileNavContent height={height} /> : <DesktopNavContent />}
      </Toolbar>
    </AppBar>
  );
};
