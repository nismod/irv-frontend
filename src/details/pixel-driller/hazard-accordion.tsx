import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { FC, ReactNode, useCallback } from 'react';
import { atom, atomFamily, useRecoilState, useSetRecoilState } from 'recoil';

import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { RagIndicator } from './rag/rag-indicator';
import { RagStatus } from './rag/rag-types';

/**
 * State family tracking expanded state of pixel driller accordions.
 * Keyed by section title/identifier.
 */
export const hazardAccordionExpandedState = atomFamily<boolean, string>({
  key: 'hazardAccordionExpandedState',
  default: false,
});

/**
 * Tracks which accordion is currently open (for single-accordion mode).
 * Set to null if no accordion is open or if multiple can be open.
 */
export const openAccordionState = atom<string | null>({
  key: 'openAccordionState',
  default: null,
});

/**
 * Counts how many accordion transitions (entering / exiting) are currently running.
 * Used to avoid scrolling while layout is still in flux.
 */
export const accordionTransitionCountState = atom<number>({
  key: 'accordionTransitionCountState',
  default: 0,
});

/**
 * Configuration: Set to false to allow multiple accordions open at once.
 * Set to true to enforce only one accordion open at a time.
 */
export const SINGLE_ACCORDION_MODE = true;

export interface PixelDrillerSectionAccordionProps {
  title: string;
  disabled?: boolean;
  /** Shown in the expand-icon slot when disabled (e.g. exposure no-data RAG). */
  disabledExpandIcon?: ReactNode;
  rightAdornment?: ReactNode;
  children: ReactNode;
}

const CHEVRON_PLACEHOLDER_SIZE_PX = 24;

/**
 * Shared accordion used by both Hazards and Exposure sections.
 * Handles the global "only one open" logic, scroll-into-view, and error boundary.
 */
export const PixelDrillerSectionAccordion: FC<PixelDrillerSectionAccordionProps> = ({
  title,
  disabled = false,
  disabledExpandIcon,
  rightAdornment,
  children,
}) => {
  const [individualExpanded, setIndividualExpanded] = useRecoilState(
    hazardAccordionExpandedState(title),
  );
  const [openAccordion, setOpenAccordion] = useRecoilState(openAccordionState);
  const setTransitionCount = useSetRecoilState(accordionTransitionCountState);

  const incrementTransition = useCallback(() => {
    setTransitionCount((n) => n + 1);
  }, [setTransitionCount]);

  const decrementTransition = useCallback(() => {
    setTransitionCount((n) => (n > 0 ? n - 1 : 0));
  }, [setTransitionCount]);

  // In single-accordion mode, use openAccordionState; otherwise use individual state.
  // However, if this section is disabled (no data / not implemented), force it
  // visually collapsed while still preserving the logical "open" selection so
  // that it can re-expand when data becomes available again.
  const isLogicallyExpanded = SINGLE_ACCORDION_MODE ? openAccordion === title : individualExpanded;
  const expanded = !disabled && isLogicallyExpanded;

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, isExpanded: boolean) => {
      if (disabled) return;
      if (SINGLE_ACCORDION_MODE) {
        // In single-accordion mode, track which accordion is open
        setOpenAccordion(isExpanded ? title : null);
      } else {
        // In multi-accordion mode, just update this accordion's state
        setIndividualExpanded(isExpanded);
      }
    },
    [disabled, title, setIndividualExpanded, setOpenAccordion],
  );

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      data-pixel-driller-section={title}
      slotProps={{
        transition: {
          onEnter: incrementTransition,
          onEntered: decrementTransition,
          onExit: incrementTransition,
          onExited: decrementTransition,
        },
      }}
    >
      <AccordionSummary
        component={disabled ? 'div' : undefined}
        expandIcon={
          disabled ? (
            <Box
              sx={{
                width: CHEVRON_PLACEHOLDER_SIZE_PX,
                height: CHEVRON_PLACEHOLDER_SIZE_PX,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {disabledExpandIcon}
            </Box>
          ) : (
            <ExpandMoreIcon />
          )
        }
        aria-disabled={disabled || undefined}
        sx={{
          ...(disabled
            ? {
                cursor: 'default !important',
                '&.MuiButtonBase-root': { cursor: 'default !important' },
                '& *': { cursor: 'default !important' },
              }
            : {
                cursor: 'pointer',
              }),
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          },
          ...(disabled
            ? {
                color: 'text.secondary',
                '&:hover': {
                  cursor: 'default',
                },
              }
            : null),
        }}
      >
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          {title}
        </Typography>
        {rightAdornment ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>{rightAdornment}</Box>
        ) : null}
      </AccordionSummary>
      <AccordionDetails>
        <ErrorBoundary message="There was a problem displaying this hazard.">
          {children}
        </ErrorBoundary>
      </AccordionDetails>
    </Accordion>
  );
};

interface HazardAccordionProps {
  title: string;
  ragStatus: RagStatus;
  children: ReactNode;
}

export const HazardAccordion: FC<HazardAccordionProps> = ({ title, ragStatus, children }) => {
  const disabled = ragStatus === 'no-data' || ragStatus === 'not-implemented';

  return (
    <PixelDrillerSectionAccordion
      title={title}
      disabled={disabled}
      rightAdornment={<RagIndicator status={ragStatus} />}
    >
      {children}
    </PixelDrillerSectionAccordion>
  );
};

interface ExposureAccordionProps {
  title: string;
  disabled?: boolean;
  children: ReactNode;
}

export const ExposureAccordion: FC<ExposureAccordionProps> = ({ title, disabled, children }) => {
  return (
    <PixelDrillerSectionAccordion
      title={title}
      disabled={disabled}
      disabledExpandIcon={disabled ? <RagIndicator status="no-data" /> : undefined}
    >
      {children}
    </PixelDrillerSectionAccordion>
  );
};
