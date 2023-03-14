import { ListItem, ListItemText } from '@mui/material';
import { Boundary, ProcessorVersion } from '@nismod/irv-autopkg-client';

import { DatasetStatusIndicator } from './DatasetStatusIndicator';

export function ProcessorVersionListItem({
  processorVersion,
  boundary,
}: {
  processorVersion: ProcessorVersion;
  boundary: Boundary;
}) {
  const meta = processorVersion.processor;
  return (
    <ListItem>
      <ListItemText
        primary={`[Dataset Title] ${meta.dataset}`}
        secondary={`[Dataset Description] ${meta.description}`}
        sx={{ flexGrow: 1 }}
      >
        {meta.dataset} ({meta.version})
      </ListItemText>

      <DatasetStatusIndicator boundary={boundary} processorVersion={processorVersion} />
    </ListItem>
  );
}
