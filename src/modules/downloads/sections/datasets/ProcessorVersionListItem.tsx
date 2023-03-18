import { Box, Collapse, ListItemButton, ListItemText, Stack } from '@mui/material';
import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { useState } from 'react';

import { firstNonEmptyString } from '@/lib/helpers';

import { DatasetDetails } from './dataset-details/DatasetDetails';
import { DatasetStatusIndicator } from './dataset-indicator/DatasetStatusIndicator';

export function ProcessorVersionListItem({
  processorVersion,
  boundary,
}: {
  processorVersion: ProcessorVersionMetadata;
  boundary: Boundary;
}) {
  const meta = processorVersion;

  const [open, setOpen] = useState(false);

  const title = firstNonEmptyString(
    meta.data_title,
    meta.data_title_long,
    meta.name,
    '[Dataset Title]',
  );

  return (
    <>
      <ListItemButton
        onClick={() => setOpen((o) => !o)}
        disableRipple
        sx={{ flexDirection: 'column' }}
      >
        <Stack
          mb={1}
          width="100%"
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <ListItemText primary={title} sx={{ flexGrow: 1 }} />

          <DatasetStatusIndicator
            boundary={boundary}
            processorVersion={processorVersion}
            onGoToDownload={() => setOpen(true)}
          />
        </Stack>
        <ListItemText secondary={`${meta.description}`} sx={{ textAlign: 'left', width: '100%' }} />
      </ListItemButton>
      <Collapse in={open}>
        <Box sx={{ minHeight: '200px' }} bgcolor="gainsboro">
          <DatasetDetails meta={meta} boundary={boundary} />
        </Box>
      </Collapse>
    </>
  );
}
