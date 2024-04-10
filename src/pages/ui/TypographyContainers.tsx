import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

export const TableCellStack = ({ children }) => {
  return <Stack spacing={2.5}>{children}</Stack>;
};

export const TableCellParagraph = ({ children }) => {
  return (
    // let parent container handle gap spacing
    <Typography paragraph={true} variant="body2" margin={0}>
      {children}
    </Typography>
  );
};
