import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC, useEffect, useState } from 'react';

import { asPixelResponse } from './data-transforms';
import { CoastalFlooding, RiverFloodingAqueduct } from './domains/aqueduct';
import { TropicalCyclonesIris } from './domains/cyclone-iris';
import { TropicalCyclonesStorm } from './domains/cyclone-storm';
import { ExtremeHeat } from './domains/extreme-heat';
import { RiverFloodingJrc } from './domains/jrc-flood';
import { Landslides } from './domains/landslide';
import { PixelResponse } from './types';

interface SiteDetailsContentProps {
  lng: number;
  lat: number;
}

/**
 * Component that displays detailed information for a selected site location.
 * Shows coordinates and hazard charts for the selected point.
 */
export const SiteDetailsContent: FC<SiteDetailsContentProps> = ({ lng, lat }) => {
  const [pixelData, setPixelData] = useState<PixelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPixelData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from API endpoint
        const response = await fetch(`/api/pixel-driller/point/${lng}/${lat}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPixelData(asPixelResponse(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pixel data');
        console.error('Error fetching pixel data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPixelData();
  }, [lng, lat]);

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        height: '100%',
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Site Details
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Longitude: {lng.toFixed(6)}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Latitude: {lat.toFixed(6)}
      </Typography>

      {loading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Loading pixel data...
          </Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="error">
            Error: {error}
          </Typography>
        </Box>
      )}

      {!loading && !error && !pixelData && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </Box>
      )}

      {!loading && !error && pixelData && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Hazard Charts
          </Typography>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">River flooding (Aqueduct)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RiverFloodingAqueduct records={pixelData.results} />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">River flooding (JRC)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RiverFloodingJrc records={pixelData.results} />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Coastal flooding</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CoastalFlooding records={pixelData.results} />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Tropical cyclones (IRIS)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TropicalCyclonesIris records={pixelData.results} />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Tropical cyclones (STORM)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TropicalCyclonesStorm records={pixelData.results} />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Landslides</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Landslides records={pixelData.results} />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Extreme heat</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ExtremeHeat records={pixelData.results} />
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};
