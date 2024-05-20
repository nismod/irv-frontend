import { Close, Menu } from '@mui/icons-material';
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Link as MuiLink,
  Stack,
  styled,
  Toolbar,
} from '@mui/material';
import { FC, forwardRef, useCallback, useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

import { useIsMobile } from './use-is-mobile';

const Link = styled(MuiLink)({
  color: 'inherit',
  textDecoration: 'none',
});

const DrawerLink = styled(Link)({
  color: '#ffffff',
  '&:hover,&:focus': {
    backgroundColor: '#213621',
  },
  '&:active,&.active': {
    backgroundColor: '#213621',
  },
});

const ToolbarLink = styled(Link)({
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
});

const ToolbarNavLink = forwardRef<any, any>(({ ...others }, ref) => (
  <ToolbarLink variant="h6" component={RouterNavLink} ref={ref} {...others} />
));
const ToolbarNavLinkSecondary = forwardRef<any, any>(({ ...others }, ref) => (
  <ToolbarLink
    variant="h6"
    sx={{ fontWeight: 400, fontSize: '1.3rem' }}
    component={RouterNavLink}
    ref={ref}
    {...others}
  />
));

const DrawerNavLink = forwardRef<any, any>(({ ...others }, ref) => (
  <DrawerLink variant="h6" component={RouterNavLink} ref={ref} {...others} />
));

const GrowingDivider = styled(Divider)({
  flexGrow: 1,
});

const navItems = [
  {
    to: '/view/hazard',
    title: 'Map',
  },
  // {
  //   to: '/view/hazard',
  //   title: 'Hazard',
  // },
  // {
  //   to: '/view/exposure',
  //   title: 'Exposure',
  // },
  // {
  //   to: '/view/vulnerability',
  //   title: 'Vulnerability',
  // },
  // {
  //   to: '/view/risk',
  //   title: 'Risk',
  // },
  {
    to: '/metrics',
    title: 'Metrics',
  },
];
const secondaryNavItems = [
  {
    to: '/data',
    title: 'About',
  },
  {
    to: '/downloads',
    title: 'Data',
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

const menuGap = 0.8;

const DesktopNavContent = (height) => (
  <>
    <Stack direction="row" alignItems="center" justifyContent="space-between" width={'100%'}>
      <Stack direction={'row'} alignItems="center" justifyContent="center" gap={2}>
        <Stack
          direction={'row'}
          alignItems="center"
          justifyContent="center"
          sx={{
            // backgroundColor: 'rgba(0,0,0, 0.4)',
            height: height,
            px: 2,
          }}
        >
          <ToolbarNavLink to="/">GRI Risk Viewer</ToolbarNavLink>
        </Stack>

        <Stack direction={'row'} alignItems="center" justifyContent="center" gap={menuGap}>
          {navItems.map(({ to, title }) => (
            <ToolbarNavLinkSecondary key={to} to={to}>
              {title}
            </ToolbarNavLinkSecondary>
          ))}
        </Stack>
      </Stack>

      {/* <GrowingDivider /> */}

      <Stack direction={'row'} alignItems="center" justifyContent="center" gap={menuGap}>
        {secondaryNavItems.map(({ to, title }) => (
          <ToolbarNavLinkSecondary key={to} to={to}>
            {title}
          </ToolbarNavLinkSecondary>
        ))}
      </Stack>
    </Stack>
  </>
);

// const topStripeHeight = 6;

export const Nav: FC<{ height: number }> = ({ height }) => {
  const isMobile = useIsMobile();

  return (
    <AppBar position="fixed" elevation={0} sx={{ color: 'white' }}>
      {/* <Box height={topStripeHeight} width="100%" bgcolor="rgb(142,193,85)" /> */}
      <Toolbar
        variant="dense"
        sx={{
          backgroundColor: 'rgb(23,38,23)',
          height: height,
        }}
      >
        {isMobile ? <MobileNavContent height={height} /> : <DesktopNavContent height={height} />}
      </Toolbar>
    </AppBar>
  );

  // return (
  //   <AppBar position="fixed" elevation={0} sx={{ color: 'white' }}>
  //     <Box height={topStripeHeight} width="100%" bgcolor="rgb(142,193,85)" />
  //     <Toolbar
  //       variant="dense"
  //       sx={{
  //         backgroundColor: 'rgb(23,38,23)',
  //         height: height - topStripeHeight,
  //       }}
  //     >
  //       {isMobile ? <MobileNavContent height={height} /> : <DesktopNavContent />}
  //     </Toolbar>
  //   </AppBar>
  // );
};
