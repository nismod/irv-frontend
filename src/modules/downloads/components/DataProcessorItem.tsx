import { List, ListItem, ListItemText } from '@mui/material';
import { Package, Processor, ProcessorVersion } from '@nismod/irv-autopkg-client';

export const DataProcessorItem = ({
  processor,
  pkg,
  packageLoading,
}: {
  processor: Processor;
  pkg: Package | null;
  packageLoading: boolean;
}) => {
  return (
    <>
      <ListItem>
        <ListItemText>[Data Product Title] {processor.name}</ListItemText>
      </ListItem>
      <List component="div" sx={{ ml: 2 }}>
        {processor.versions.map((v) => (
          <DataProcessorVersionItem key={v.version} processorVersion={v} />
        ))}
      </List>
    </>
  );
};

function DataProcessorVersionItem({ processorVersion }: { processorVersion: ProcessorVersion }) {
  const meta = processorVersion.processor;
  return (
    <ListItem>
      <ListItemText
        primary={`[Dataset Title] ${meta.dataset}`}
        secondary={`[Dataset Description] ${meta.description}`}
      >
        {meta.dataset} ({meta.version})
      </ListItemText>
    </ListItem>
  );
}
