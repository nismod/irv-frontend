import useMediaQuery from '@mui/material/useMediaQuery';

export function useIsMobile() {
  return useMediaQuery((theme: any) => theme.breakpoints.down('md'));
}
