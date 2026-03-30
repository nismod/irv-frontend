import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FC, ReactNode, useState } from 'react';
import type { MarkerEvent } from 'react-map-gl/maplibre';
import { Marker, Popup } from 'react-map-gl/maplibre';

import { MarkerPinIcon } from './MarkerPinIcon';

function hasPopupContent(
  content: string | ReactNode | undefined,
): content is string | Exclude<ReactNode, undefined | null> {
  if (content == null) {
    return false;
  }
  if (typeof content === 'string') {
    return content.length > 0;
  }
  return true;
}

function PopupBody({ content }: { content: string | ReactNode }) {
  if (typeof content === 'string') {
    return (
      <Typography variant="body2" component="div">
        {content}
      </Typography>
    );
  }
  return <>{content}</>;
}

export interface MapMarkerProps {
  latitude: number;
  longitude: number;
  /** When set and non-empty (non-empty string), click toggles a popup. Omit for pin only. */
  popupContent?: string | ReactNode;
  /**
   * Initial popup visibility when `popupContent` is present.
   * Defaults to true when there is popup content.
   */
  popupDefaultOpen?: boolean;
  /** Marker graphic; defaults to `MarkerPinIcon`. */
  icon?: ReactNode;
}

/**
 * Map pin for use inside a react-map-gl `Map` (e.g. nested under a data-map embed).
 * Click the pin to toggle the popup when `popupContent` is set.
 */
export const MapMarker: FC<MapMarkerProps> = ({
  latitude,
  longitude,
  popupContent,
  popupDefaultOpen = true,
  icon = <MarkerPinIcon />,
}) => {
  const canShowPopup = hasPopupContent(popupContent);

  const [open, setOpen] = useState(() => {
    if (!canShowPopup) {
      return false;
    }
    return popupDefaultOpen;
  });

  const handleMarkerClick = (e: MarkerEvent<MouseEvent>) => {
    e.originalEvent.stopPropagation();
    if (!canShowPopup) {
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <>
      <Marker
        longitude={longitude}
        latitude={latitude}
        anchor="bottom"
        onClick={handleMarkerClick}
        style={{ cursor: canShowPopup ? 'pointer' : 'default' }}
      >
        {icon}
      </Marker>
      {canShowPopup && open ? (
        <Popup
          longitude={longitude}
          latitude={latitude}
          anchor="bottom"
          offset={[0, -36]}
          onClose={() => setOpen(false)}
          closeButton
          closeOnClick={false}
          maxWidth="240px"
        >
          <Paper elevation={0} sx={{ p: 1, bgcolor: 'background.paper' }}>
            <Box sx={{ maxWidth: 220 }}>
              <PopupBody content={popupContent} />
            </Box>
          </Paper>
        </Popup>
      ) : null}
    </>
  );
};
