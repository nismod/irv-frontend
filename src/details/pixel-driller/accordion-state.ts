import { atom, atomFamily } from 'recoil';

/**
 * State family tracking expanded state of hazard accordions.
 * Keyed by hazard title/identifier.
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
 * Configuration: Set to false to allow multiple accordions open at once.
 * Set to true to enforce only one accordion open at a time.
 */
export const SINGLE_ACCORDION_MODE = true;
