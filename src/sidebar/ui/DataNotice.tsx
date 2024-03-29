import { Box, Typography } from '@mui/material';

/* Container for siderbar section or control description. */
export const DataNotice = ({ children }) => {
  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>{children}</Box>;
};

/* Block of text within a DataNotice. */
export const DataNoticeTextBlock = ({ children }) => {
  return (
    // Let parent handle spacing.
    <Typography variant="body2" paragraph={true} sx={{ m: 0 }}>
      {children}
    </Typography>
  );
};
