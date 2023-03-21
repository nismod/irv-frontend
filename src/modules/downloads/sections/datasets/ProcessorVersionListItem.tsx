import { Box, Collapse, ListItemButton, ListItemText, Stack } from '@mui/material';
import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { useCallback, useRef } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

import { firstNonEmptyString } from '@/lib/helpers';

import { globalStyleVariables } from '@/theme';

import { DatasetDetails } from './dataset-details/DatasetDetails';
import { DatasetStatusIndicator } from './dataset-indicator/DatasetStatusIndicator';

const expandedDatasetByRegionState = atomFamily<string | null, string>({
  key: 'expandedDatasetByRegion',
  default: null,
});

function useOpen(boundaryName: string, processorVersion: string) {
  const [expandedDataset, setExpandedDataset] = useRecoilState(
    expandedDatasetByRegionState(boundaryName),
  );

  const open = expandedDataset === processorVersion;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        setExpandedDataset(processorVersion);
      } else {
        if (open) {
          setExpandedDataset(null);
        }
      }
    },
    [open, setExpandedDataset, processorVersion],
  );

  return [open, setOpen] as const;
}

export function ProcessorVersionListItem({
  processorVersion,
  boundary,
}: {
  processorVersion: ProcessorVersionMetadata;
  boundary: Boundary;
}) {
  const meta = processorVersion;

  const [open, setOpen] = useOpen(boundary.name, processorVersion.name);

  const listItemRef = useRef<HTMLDivElement>();

  const title = firstNonEmptyString(
    meta.data_title,
    meta.data_title_long,
    meta.name,
    '[Dataset Title]',
  );

  return (
    <>
      <ListItemButton
        ref={listItemRef}
        onClick={() => setOpen(!open)}
        disableRipple
        sx={{
          flexDirection: 'column',
          borderTop: '1px solid gainsboro',
          scrollMarginTop: globalStyleVariables.navbarHeight,
        }}
      >
        <Stack
          mb={1}
          width="100%"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          alignItems={{ xs: 'start', sm: 'center' }}
          justifyContent="space-between"
        >
          <ListItemText primary={title} sx={{ flexGrow: 1 }} />

          <Box alignSelf={{ xs: 'end', sm: 'center' }}>
            <DatasetStatusIndicator
              boundary={boundary}
              processorVersion={processorVersion}
              onGoToDownload={() => setOpen(true)}
            />
          </Box>
        </Stack>
        <ListItemText secondary={`${meta.description}`} sx={{ textAlign: 'left', width: '100%' }} />
      </ListItemButton>
      <Collapse
        in={open}
        onTransitionEnd={() => {
          if (open && listItemRef.current) {
            scrollIntoViewIfNeeded(listItemRef.current);
          }
        }}
      >
        <Box sx={{ minHeight: '200px' }} bgcolor="#fafafa">
          <DatasetDetails meta={meta} boundary={boundary} />
        </Box>
      </Collapse>
    </>
  );
}

/**
 * Simple function to scroll into view if the list item is not visible
 * Relies on the nav bar height to prevent element being obscured
 */
function scrollIntoViewIfNeeded(elem: HTMLElement) {
  const { top } = elem.getBoundingClientRect();

  if (top < globalStyleVariables.navbarHeight) {
    elem.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }
}
