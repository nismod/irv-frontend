import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { FC, ReactNode, useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import {
  hazardAccordionExpandedState,
  openAccordionState,
  SINGLE_ACCORDION_MODE,
} from './accordion-state';
import { RagIndicator, RagStatus } from './rag-indicator';

interface HazardAccordionProps {
  title: string;
  ragStatus: RagStatus;
  children: ReactNode;
}

export const HazardAccordion: FC<HazardAccordionProps> = ({ title, ragStatus, children }) => {
  const [individualExpanded, setIndividualExpanded] = useRecoilState(
    hazardAccordionExpandedState(title),
  );
  const [openAccordion, setOpenAccordion] = useRecoilState(openAccordionState);

  // In single-accordion mode, use openAccordionState; otherwise use individual state
  const expanded = SINGLE_ACCORDION_MODE ? openAccordion === title : individualExpanded;

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, isExpanded: boolean) => {
      if (SINGLE_ACCORDION_MODE) {
        // In single-accordion mode, track which accordion is open
        setOpenAccordion(isExpanded ? title : null);
      } else {
        // In multi-accordion mode, just update this accordion's state
        setIndividualExpanded(isExpanded);
      }
    },
    [title, setIndividualExpanded, setOpenAccordion],
  );

  return (
    <Accordion expanded={expanded} onChange={handleChange} data-hazard-title={title}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <RagIndicator status={ragStatus} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <ErrorBoundary message="There was a problem displaying this hazard.">
          {children}
        </ErrorBoundary>
      </AccordionDetails>
    </Accordion>
  );
};
