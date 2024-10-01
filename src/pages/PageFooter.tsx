import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Link as MuiLink, Stack, styled } from '@mui/material';
import { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';

import { ExtLink } from '@/lib/nav';

const linkStyles = {
  color: 'inherit',
  fontSize: '1em',
  fontWeight: 400,
};
const Link = styled(MuiLink)(linkStyles);
const FooterNavLink = forwardRef<any, any>(({ ...others }, ref) => (
  <Link variant="h6" component={NavLink} ref={ref} {...others} />
));
const FooterExtLink = ({ children, href }) => (
  <ExtLink variant="h6" sx={linkStyles} href={href}>
    {children}&nbsp;
    <small>
      <OpenInNewIcon fontSize="inherit" sx={{ marginBottom: '0.25em' }} />
    </small>
  </ExtLink>
);

export const PageFooter = () => (
  <Box padding={4} borderTop={'1px solid #aca2a3'}>
    <footer>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        flexWrap="wrap"
        spacing={{ md: 1, lg: 4 }}
        sx={{ mt: 4, mb: 2 }}
        justifyContent="left"
        alignItems="left"
      >
        <FooterNavLink to="/" sx={{ fontWeight: 600, textDecoration: 'none' }}>
          GRI Risk Viewer
        </FooterNavLink>
        <FooterNavLink to="/about">About</FooterNavLink>
        <FooterNavLink to="/terms-of-use">Terms and Policies</FooterNavLink>
        <FooterNavLink to="/data">Data Sources</FooterNavLink>
        <FooterExtLink href="https://github.com/nismod">GitHub</FooterExtLink>
        <FooterExtLink href="https://opsis.eci.ox.ac.uk">OPSIS</FooterExtLink>
      </Stack>
    </footer>
  </Box>
);
