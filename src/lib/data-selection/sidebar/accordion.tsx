import {
  Box,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  styled,
  Typography,
} from '@mui/material';

export const Accordion = styled(MuiAccordion)({
  pointerEvents: 'auto',
  marginBottom: 1,
  borderRadius: 1,
  overflow: 'hidden',
});

export const AccordionSummary = styled(MuiAccordionSummary)({
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  flexDirection: 'row-reverse', // this puts the expand icon to the left of the summary bar
  '& .MuiAccordionSummary-content': {
    marginTop: '0',
    marginBottom: '0',
  },
  paddingRight: '5px',
  paddingLeft: '5px',
  paddingTop: '4px',
  paddingBottom: '4px',
  minHeight: '40px',
});

export const AccordionDetails = styled(MuiAccordionDetails)({});

export const AccordionTitle = ({ title, actions }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography>{title}</Typography>
      </Box>
      <Box>{actions}</Box>
    </Box>
  );
};
