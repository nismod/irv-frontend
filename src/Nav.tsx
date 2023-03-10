import { Menu } from '@mui/icons-material';
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Link as MuiLink,
  Toolbar,
  styled,
} from '@mui/material';
import { Box } from '@mui/system';
import { FC, forwardRef, useCallback, useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

import { useIsMobile } from './use-is-mobile';

const Link = styled(MuiLink)({
  color: 'inherit',
  textDecoration: 'none',
});

const DrawerLink = styled(Link)({
  '&.active': {
    backgroundColor: '#eeeeee',
  },
});

const ToolbarLink = styled(Link)({
  padding: '0 3px 1px 3px',
  margin: '0 9px -10px 9px',
  borderBottom: '6px solid transparent',
  '&:hover,&:focus': {
    borderBottomColor: '#ffffffbc',
  },
  '&:active,&.active': {
    borderBottomColor: '#ffffff',
  },
});

const ToolbarNavLink = forwardRef<any, any>(({ ...others }, ref) => (
  <ToolbarLink variant="h6" component={RouterNavLink} ref={ref} {...others} />
));

const DrawerNavLink = forwardRef<any, any>(({ ...others }, ref) => (
  <DrawerLink component={RouterNavLink} ref={ref} {...others} />
));

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
    to: '/data',
    title: 'About',
  },
];

const drawerWidth = 240;

const MobileDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
});

const MobileNavContent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={() => setDrawerOpen((open) => !open)} title="Menu">
        <Menu />
      </IconButton>

      <ToolbarNavLink to="/" onClick={closeDrawer}>
        G-SRAT
      </ToolbarNavLink>

      <GrowingDivider />

      <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
        <Toolbar /> {/* Prevents app bar from concealing content*/}
        <List>
          <ListItem component={DrawerNavLink} to="/" onClick={closeDrawer}>
            Home
          </ListItem>
          {navItems.map(({ to, title }) => (
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
    <ToolbarNavLink to="/">G-SRAT</ToolbarNavLink>

    {navItems.map(({ to, title }) => (
      <ToolbarNavLink key={to} to={to}>
        {title}
      </ToolbarNavLink>
    ))}

    <GrowingDivider />
  </>
);

const topStripeHeight = 6;

export const Nav: FC<{ height: number }> = ({ height }) => {
  const isMobile = useIsMobile();

  return (
    <AppBar position="fixed" sx={{ color: 'white' }}>
      <Box height={topStripeHeight} width="100%" bgcolor="rgb(197,206,0)" />
      <Toolbar
        variant="dense"
        sx={{
          backgroundColor: 'rgb(0,126,133)',
          height: height - topStripeHeight,
        }}
      >
        {isMobile ? <MobileNavContent /> : <DesktopNavContent />}
      </Toolbar>
    </AppBar>
  );
};
