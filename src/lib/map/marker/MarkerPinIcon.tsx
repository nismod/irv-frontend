import { FC } from 'react';

/** Default red map pin SVG for map markers (e.g. `MapMarker`). */
export const MarkerPinIcon: FC = () => (
  <svg width="32" height="40" viewBox="0 0 32 40" aria-hidden>
    <path
      d="M16 0C9.4 0 4 5.2 4 11.6c0 8.8 12 26.4 12 26.4s12-17.6 12-26.4C28 5.2 22.6 0 16 0z"
      fill="#c62828"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <circle cx="16" cy="12" r="4" fill="#fff" />
  </svg>
);
