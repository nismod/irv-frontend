import { Box, Paper, TableContainer, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

export const TableSectionContainer = ({ children }) => {
  return (
    // MUI tables lose dynamic styling in flex containers, so use margins for centering
    <Box marginX={'auto'} maxWidth={'fit-content'} marginY={6}>
      <Box component={'div'} maxWidth={'75rem'} paddingX={2}>
        {children}
      </Box>
    </Box>
  );
};

export const StyledTableContainer = ({ children }) => {
  return <TableContainer component={Paper}>{children}</TableContainer>;
};

export const TableCellStack = ({ children }) => {
  return <Stack spacing={2.5}>{children}</Stack>;
};

export const TableHeader = ({ children }) => {
  return (
    <Typography variant="h2" marginLeft={1}>
      {children}
    </Typography>
  );
};

export const TableCellParagraph = ({ children }) => {
  return (
    // let parent container handle gap spacing
    <Typography paragraph={true} variant="body2" margin={0}>
      {children}
    </Typography>
  );
};
