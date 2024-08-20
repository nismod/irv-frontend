import { Close, Menu } from '@mui/icons-material';
// import AccountCircle from '@mui/icons-material/AccountCircle';
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Link as MuiLink,
  Stack,
  styled,
  Toolbar,
  // Typography,
} from '@mui/material';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FC, forwardRef, MouseEvent, useCallback, useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

// import { useIsMobile } from './use-is-mobile';

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
  // padding: '0 0 1px 0',
  // margin: '0 9px -10px 9px',
  whiteSpace: 'nowrap',
  textOverflow: 'clip',
  // borderBottom: '4px solid transparent',
  '&:hover,&:focus': {
    borderBottomColor: '#ffffff',
  },
  '&:active,&.active': {
    borderBottomColor: '#ffffff',
  },
  // boxSizing: 'content-box',
});

const ToolbarNavLink = forwardRef<any, any>(({ ...others }, ref) => (
  <ToolbarLink
    variant="h6"
    sx={{ fontWeight: 400, fontSize: '1.3rem' }}
    component={RouterNavLink}
    ref={ref}
    {...others}
  />
));

const ToolbarHomeLink = forwardRef<any, any>(({ ...others }, ref) => (
  <ToolbarLink
    // variant="h6"
    sx={{ fontWeight: 1000, fontSize: '1.6rem' }}
    component={RouterNavLink}
    ref={ref}
    {...others}
  />
));

const ToolbarNavLinkSecondary = forwardRef<any, any>(({ ...others }, ref) => (
  <ToolbarLink
    // variant="h6"
    sx={{ fontWeight: 400, fontSize: '1.3rem' }}
    component={RouterNavLink}
    ref={ref}
    {...others}
  />
));

const ToolbarNavLinkMenu = forwardRef<any, any>(({ ...others }, ref) => (
  <ToolbarLink
    // variant="h6"
    // sx={{ fontWeight: 400, fontSize: '1.3rem' }}
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

const toolbarItems = [
  // {
  //   to: '/view/hazard',
  //   title: 'Map',
  // },
  {
    to: '/metrics/regions/afg',
    title: 'Metrics',
  },
];

const aboutToolbarItem = {
  to: '/about',
  title: 'About',
};

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
    to: '/view/hazard',
    title: 'Map',
  },
  {
    to: '/data',
    title: 'About',
  },
  {
    to: '/downloads',
    title: 'Data',
  },
];

const mapNavItems = [
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
];

const dataNavItems = [
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

const MapMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton> */}
      <Button
        variant="text"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        style={{ textTransform: 'none' }}
        sx={{
          fontWeight: 400,
          fontSize: '1.3rem',
          // borderBottom: '4px solid transparent',
          // '&:hover,&:focus': {
          //   borderBottomColor: '#ffffff',
          // },
          // '&:active,&.active': {
          //   borderBottomColor: '#ffffff',
          // },
        }}
      >
        <ToolbarNavLinkSecondary>Map</ToolbarNavLinkSecondary>
      </Button>
      <MuiMenu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {mapNavItems.map(({ to, title }) => (
          <MenuItem onClick={handleClose} key={title}>
            <ToolbarNavLinkMenu to={to}>{title}</ToolbarNavLinkMenu>
          </MenuItem>
        ))}

        {/* <MenuItem onClick={handleClose}>Sources</MenuItem>
        <MenuItem onClick={handleClose}>Downloads</MenuItem> */}
      </MuiMenu>
    </div>
  );
};

const DummyMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton> */}
      <Button
        variant="text"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        style={{ textTransform: 'none' }}
        sx={{
          fontWeight: 400,
          fontSize: '1.3rem',
          // borderBottom: '4px solid transparent',
          // '&:hover,&:focus': {
          //   borderBottomColor: '#ffffff',
          // },
          // '&:active,&.active': {
          //   borderBottomColor: '#ffffff',
          // },
        }}
      >
        <ToolbarNavLinkSecondary>Data</ToolbarNavLinkSecondary>
      </Button>
      <MuiMenu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {dataNavItems.map(({ to, title }) => (
          <MenuItem onClick={handleClose} key={to}>
            <ToolbarNavLinkMenu to={to}>{title}</ToolbarNavLinkMenu>
          </MenuItem>
        ))}

        {/* <MenuItem onClick={handleClose}>Sources</MenuItem>
        <MenuItem onClick={handleClose}>Downloads</MenuItem> */}
      </MuiMenu>
    </div>
  );
};

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
            <ListItem key={title} component={DrawerNavLink} to={to} onClick={closeDrawer}>
              {title}
            </ListItem>
          ))}
        </List>
        <List sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.4)', padding: 0 }}>
          {secondaryNavItems.map(({ to, title }) => (
            <ListItem key={title} component={DrawerNavLink} to={to} onClick={closeDrawer}>
              {title}
            </ListItem>
          ))}
        </List>
      </MobileDrawer>
    </>
  );
};

// const menuGap = 0.8;

const DesktopNavContent = (height) => (
  <>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width={'100%'}
      paddingX={'4rem'}
    >
      {/* <Stack
        direction={'row'}
        alignItems="center"
        justifyContent="center"
        sx={{
          // backgroundColor: 'rgba(0,0,0, 0.4)',
          height: height,
          px: 2,
        }}
      > */}

      <Button
        variant="text"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        // onClick={handleMenu}
        color="inherit"
        style={{ textTransform: 'none' }}
      >
        <ToolbarHomeLink to="/">GRI Risk Viewer</ToolbarHomeLink>
      </Button>
      {/* </Stack> */}

      <Stack direction={'row'} gap={1}>
        {/* <Stack direction={'row'} alignItems="center" justifyContent="center" gap={menuGap}>
          {navItems.map(({ to, title }) => (
            <ToolbarNavLinkSecondary key={to} to={to}>
              {title}
            </ToolbarNavLinkSecondary>
          ))}
        </Stack> */}
        {/* </Stack> */}
        {/* <GrowingDivider /> */}
        {/* <Stack direction={'row'} alignItems="center" justifyContent="center" gap={menuGap}> */}
        <MapMenu />

        {toolbarItems.map(({ to, title }) => (
          <Button
            variant="text"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            // onClick={handleMenu}
            color="inherit"
            style={{ textTransform: 'none' }}
            key={title}
          >
            <ToolbarNavLinkSecondary key={to} to={to}>
              {title}
            </ToolbarNavLinkSecondary>
          </Button>
        ))}

        <DummyMenu />

        <Button
          variant="text"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          // onClick={handleMenu}
          color="inherit"
          style={{ textTransform: 'none' }}
        >
          <ToolbarNavLinkSecondary key={aboutToolbarItem.to} to={aboutToolbarItem.to}>
            {aboutToolbarItem.title}
          </ToolbarNavLinkSecondary>
        </Button>
      </Stack>
    </Stack>
  </>
);

// const topStripeHeight = 6;

export const Nav: FC<{ height: number }> = ({ height }) => {
  const isMobile = false; // useIsMobile();

  return (
    <AppBar position="fixed" elevation={0} sx={{ color: 'white' }}>
      {/* <Box height={topStripeHeight} width="100%" bgcolor="rgb(142,193,85)" /> */}
      <Toolbar
        variant="dense"
        sx={{
          // backgroundColor: 'rgb(23,38,23)',
          backgroundColor: 'black',
          backgroundImage: `linear-gradient(to left, rgba(23,38,23, 0.8), rgba(23,38,23, 1))`,
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
