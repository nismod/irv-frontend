import { useTabContext } from '@mui/lab';
import { Box } from '@mui/material';

/**
 * TabPanel that doesn't unmount inactive tabs, only uses display:none
 */
export const NonUnmountingTabPanel = ({ value, children }) => {
  const context = useTabContext();

  return <Box display={value === context?.value ? 'block' : 'none'}>{children}</Box>;
};
