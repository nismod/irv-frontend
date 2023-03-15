import { ListItem, ListItemText } from '@mui/material';
import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';

import { DatasetStatusIndicator } from './DatasetStatusIndicator';

export function ProcessorVersionListItem({
  processorVersion,
  boundary,
}: {
  processorVersion: ProcessorVersionMetadata;
  boundary: Boundary;
}) {
  const meta = processorVersion;
  return (
    <ListItem>
      <ListItemText
        primary={`[Dataset Title] ${meta.data_title}`}
        secondary={`[Dataset Description] ${meta.description}`}
        sx={{ flexGrow: 1 }}
      >
        {meta.data_title_long} ({meta.version})
      </ListItemText>

      <DatasetStatusIndicator boundary={boundary} processorVersion={processorVersion} />
    </ListItem>
  );
}
