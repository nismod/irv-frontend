import { Close } from '@mui/icons-material';
import { Alert, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { buildZipFile } from '@/lib/downloads/download-utils';
import { DownloadButton } from '@/lib/downloads/DownloadButton';
import { DownloadFile } from '@/lib/downloads/types';
import { ExtLink } from '@/lib/nav';
import { CopyableLink } from '@/lib/nav/CopyableLink';

import { pixelDrillerClickLocationAtom } from '@/state/map-view/map-interaction-state';
import { pixelDrillerSiteUrlAtom } from '@/state/map-view/pixel-driller-url-state';

import { PixelDrillerLayerList } from './contents/PixelDrillerLayerList';
import { asPixelResponse } from './data-transforms';
import { DownloadDataProvider, useDownloadDataContext } from './download/download-context';
import { buildReadmeFile } from './download/download-generators';
import { createSpatialPoint } from './download/metadata-common';
import { RdlsMetadataPackage } from './download/metadata-types';
import { accordionTransitionCountAtom, openAccordionAtom } from './hazard-accordion';
import { PixelResponse } from './types';

interface SiteDetailsContentProps {
  lng: number;
  lat: number;
}

interface PixelDataRequestState {
  coordinateKey: string;
  data: PixelResponse | null;
  error: string | null;
}

/**
 * Inner component that uses the download context.
 * Separated to allow context access within the provider.
 */
const SiteDetailsContentInner: FC<SiteDetailsContentProps> = ({ lng, lat }) => {
  const coordinateKey = `${lng}:${lat}`;
  const [pixelDataRequest, setPixelDataRequest] = useState<PixelDataRequestState | null>(null);
  const currentPixelDataRequest =
    pixelDataRequest?.coordinateKey === coordinateKey ? pixelDataRequest : null;
  const pixelData = currentPixelDataRequest?.data ?? null;
  const error = currentPixelDataRequest?.error ?? null;
  const loading = currentPixelDataRequest === null;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const openAccordion = useAtomValue(openAccordionAtom);
  const transitionCount = useAtomValue(accordionTransitionCountAtom);
  const { getAllExportConfigs } = useDownloadDataContext();
  const setPixelDrillerClickLocation = useSetAtom(pixelDrillerClickLocationAtom);
  const setPixelDrillerSiteParam = useSetAtom(pixelDrillerSiteUrlAtom);

  const coordinatesUrl = useMemo(() => {
    const siteValue = `"${lat.toFixed(6)},${lng.toFixed(6)}"`;
    const params = new URLSearchParams({
      site: siteValue,
      x: lng.toFixed(6),
      y: lat.toFixed(6),
      z: '9',
    });
    return `/view/hazard?${params.toString()}`;
  }, [lat, lng]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchPixelData = async () => {
      try {
        // Fetch from API endpoint
        const response = await fetch(`/api/pixel-driller/point/${lng}/${lat}`, {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPixelDataRequest({
          coordinateKey,
          data: asPixelResponse(data),
          error: null,
        });
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }

        setPixelDataRequest({
          coordinateKey,
          data: null,
          error: err instanceof Error ? err.message : 'Failed to fetch site data',
        });
        console.error('Error fetching pixel data:', err);
      }
    };
    fetchPixelData();

    return () => {
      abortController.abort();
    };
  }, [lng, lat, coordinateKey]);

  // Scroll the currently open section into view once layout is stable
  // (no accordion transitions in flight) and data is loaded.
  // Uses a smooth animation in all cases (location or section changes).
  useEffect(() => {
    if (loading || error || !pixelData) return;
    if (!openAccordion) return;
    if (transitionCount > 0) return;

    const section = document.querySelector<HTMLElement>(
      `[data-pixel-driller-section="${openAccordion}"]`,
    );
    if (!section) return;

    const container = section.closest<HTMLElement>('[data-accordion-scroll-container]');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = section.getBoundingClientRect();

    const containerHeight = containerRect.height;
    const targetHeight = targetRect.height;
    const padding = 10; // px of desired space above/below when possible

    let delta = 0;

    if (targetHeight >= containerHeight) {
      // Target taller than container: align the top edge with padding if possible.
      delta = targetRect.top - (containerRect.top + padding);
    } else {
      const isAbove = targetRect.top < containerRect.top + padding;
      const isBelow = targetRect.bottom > containerRect.bottom - padding;

      if (isAbove) {
        delta = targetRect.top - (containerRect.top + padding);
      } else if (isBelow) {
        delta = targetRect.bottom - (containerRect.bottom - padding);
      }
    }

    if (delta !== 0) {
      container.scrollTo({
        top: container.scrollTop + delta,
        behavior: 'smooth',
      });
    }
  }, [loading, error, pixelData, openAccordion, transitionCount, lng, lat]);

  const makeDownloadZipFile = useCallback(async (): Promise<DownloadFile> => {
    const exportConfigs = getAllExportConfigs();
    const allRecords = pixelData.results;

    // Call all registered export functions with the full dataset
    const exportPromises: Promise<DownloadFile>[] = Array.from(exportConfigs.entries()).map(
      async ([key, { exportFunction }]) => {
        try {
          return await exportFunction(allRecords);
        } catch (err) {
          console.error(`Error exporting data for ${key}:`, err);
          return null as DownloadFile;
        }
      },
    );
    const exportFileGroups = await Promise.all(exportPromises);
    let exportFiles = exportFileGroups.filter(Boolean) as DownloadFile[];

    // Build RDLS-style metadata.json from registered export configurations.
    const spatial = createSpatialPoint(lat, lng);
    const datasets = Array.from(exportConfigs.values())
      .map(({ metadataFunction }) => metadataFunction({ spatial }))
      .filter(Boolean) as RdlsMetadataPackage['datasets'];

    const metadata: RdlsMetadataPackage = {
      $schema: './metadata.schema.json',
      datasets,
    };

    const metadataFile: DownloadFile = {
      filename: 'metadata.json',
      content: JSON.stringify(metadata, null, 2),
      mimeType: 'application/json',
    };

    const readmeFile = buildReadmeFile(exportConfigs);

    exportFiles = [readmeFile, metadataFile, ...exportFiles];
    const zipBlob = await buildZipFile(exportFiles);
    const filename = `site-details-${lat.toFixed(6)}-${lng.toFixed(6)}.zip`;

    return {
      content: zipBlob,
      filename,
    };
  }, [pixelData, getAllExportConfigs, lat, lng]);

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
        <Box>
          <DownloadButton
            title="Download site data package"
            makeFile={makeDownloadZipFile}
            disabled={!pixelData || loading || !!error}
          />
          <IconButton
            title="Exit site inspection mode"
            onClick={() => {
              setPixelDrillerClickLocation(null);
              setPixelDrillerSiteParam(null);
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Coordinates:{' '}
        <CopyableLink
          href={coordinatesUrl}
          component={RouterLink}
          label={`${lat.toFixed(6)}, ${lng.toFixed(6)}`}
          copyTooltip="Copy site URL"
        />
      </Typography>

      <Alert severity="info">
        <Typography variant="body2">
          This site inspection tool is a work-in-progress. Please{' '}
          <ExtLink href="mailto:tom.russell@ouce.ox.ac.uk?subject=GRI Risk Viewer Site Inspection tool">
            contact us
          </ExtLink>{' '}
          or{' '}
          <ExtLink href="https://github.com/nismod/infra-risk-vis/issues/">report an issue</ExtLink>
          .
        </Typography>
      </Alert>

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

      {!loading && !error && pixelData && <PixelDrillerLayerList records={pixelData.results} />}
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
