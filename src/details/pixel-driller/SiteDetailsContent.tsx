import DownloadIcon from '@mui/icons-material/Download';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { openAccordionState } from './accordion-state';
import { asPixelResponse } from './data-transforms';
import { CoastalFlooding, RiverFloodingAqueduct } from './domains/aqueduct';
import { CoolingDegreeDays } from './domains/cooling-degree-days';
import { TropicalCyclonesIris } from './domains/cyclone-iris';
import { TropicalCyclonesStorm } from './domains/cyclone-storm';
import { Droughts } from './domains/droughts';
import { Earthquakes } from './domains/earthquakes';
import { ExtremeHeat } from './domains/extreme-heat';
import { RiverFloodingJrc } from './domains/jrc-flood';
import { Landslides } from './domains/landslide';
import { DownloadDataProvider, useDownloadDataContext } from './download-context';
import { buildZipFile, downloadBlob } from './download-utils';
import mockPixelData from './mock/pixel_values.json';
import { PixelResponse } from './types';

interface SiteDetailsContentProps {
  lng: number;
  lat: number;
}

/**
 * Inner component that uses the download context.
 * Separated to allow context access within the provider.
 */
const SiteDetailsContentInner: FC<SiteDetailsContentProps> = ({ lng, lat }) => {
  const [pixelData, setPixelData] = useState<PixelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const openAccordion = useRecoilValue(openAccordionState);
  const { getAllExportFunctions } = useDownloadDataContext();

  const coordinatesUrl = useMemo(
    () =>
      `/view/hazard?site=${lat.toFixed(6)},${lng.toFixed(6)}&x=${lng.toFixed(6)}&y=${lat.toFixed(6)}&z=9`,
    [lat, lng],
  );

  useEffect(() => {
    // TODO: Temporarily using mock data for performance during testing
    // Switch back to API fetch by uncommenting the code below and removing the mock data loading
    setLoading(true);
    setError(null);

    // Load mock data (temporary)
    setTimeout(() => {
      try {
        setPixelData(asPixelResponse(mockPixelData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mock pixel data');
        console.error('Error loading mock pixel data:', err);
      } finally {
        setLoading(false);
      }
    }, 100); // Small delay to simulate loading

    // API fetch code (commented out temporarily)
    // const fetchPixelData = async () => {
    //   setLoading(true);
    //   setError(null);
    //   try {
    //     // Fetch from API endpoint
    //     const response = await fetch(`/api/pixel-driller/point/${lng}/${lat}`);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const data = await response.json();
    //     setPixelData(asPixelResponse(data));
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : 'Failed to fetch pixel data');
    //     console.error('Error fetching pixel data:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPixelData();
  }, [lng, lat]);

  // Scroll behavior when data loads or open accordion changes
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // While loading or on error / no data, keep scroll at top
    if (loading || error || !pixelData) {
      container.scrollTop = 0;
      return;
    }

    // If no accordion is expanded, keep scroll at top
    if (!openAccordion) {
      container.scrollTop = 0;
      return;
    }

    // Scroll the expanded accordion into view (no animation)
    const target = container.querySelector<HTMLElement>(`[data-hazard-title="${openAccordion}"]`);
    if (target) {
      // Let the browser choose the appropriate scroll container and adjust immediately
      target.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
    }
  }, [loading, error, pixelData, openAccordion]);

  const handleDownload = useCallback(async () => {
    if (!pixelData || loading || error) return;

    setDownloading(true);
    try {
      const exportFunctions = getAllExportFunctions();
      const allRecords = pixelData.results;

      // Call all registered export functions with the full dataset
      const exportPromises = Array.from(exportFunctions.entries()).map(async ([key, fn]) => {
        try {
          return await fn(allRecords);
        } catch (err) {
          console.error(`Error exporting data for ${key}:`, err);
          return null;
        }
      });

      const exportFiles = await Promise.all(exportPromises);
      const validFiles = exportFiles.filter(
        (file): file is NonNullable<typeof file> => file !== null,
      );

      if (validFiles.length === 0) {
        console.warn('No export files generated');
        return;
      }

      // Build ZIP file
      const zipBlob = await buildZipFile(validFiles);

      // Generate filename with coordinates
      const filename = `pixel-driller-${lat.toFixed(6)}-${lng.toFixed(6)}.zip`;
      downloadBlob(zipBlob, filename);
    } catch (err) {
      console.error('Error creating download:', err);
      setError(err instanceof Error ? err.message : 'Failed to create download');
    } finally {
      setDownloading(false);
    }
  }, [pixelData, loading, error, getAllExportFunctions, lat, lng]);

  return (
    <Box
      ref={containerRef}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Site Details</Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!pixelData || loading || !!error || downloading}
        >
          {downloading ? 'Preparing...' : 'Download'}
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Coordinates:{' '}
        <Link component={RouterLink} to={coordinatesUrl}>
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </Link>
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
          <RiverFloodingAqueduct records={pixelData.results} />
          <RiverFloodingJrc records={pixelData.results} />
          <CoastalFlooding records={pixelData.results} />
          <TropicalCyclonesIris records={pixelData.results} />
          <TropicalCyclonesStorm records={pixelData.results} />
          <CoolingDegreeDays records={pixelData.results} />
          <ExtremeHeat records={pixelData.results} />
          <Droughts records={pixelData.results} />
          <Landslides records={pixelData.results} />
          <Earthquakes records={pixelData.results} />
        </Box>
      )}
    </Box>
  );
};

/**
 * Component that displays detailed information for a selected site location.
 * Shows coordinates and hazard charts for the selected point.
 * Wraps content with DownloadDataProvider to enable export functionality.
 */
export const SiteDetailsContent: FC<SiteDetailsContentProps> = ({ lng, lat }) => {
  return (
    <DownloadDataProvider>
      <SiteDetailsContentInner lng={lng} lat={lat} />
    </DownloadDataProvider>
  );
};
