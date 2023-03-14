import { List, ListItem, ListItemText } from '@mui/material';
import { Boundary, Processor } from '@nismod/irv-autopkg-client';
import { Fragment } from 'react';

import { ProcessorVersionListItem } from './ProcessorVersionListItem';

export const ProcessorListItem = ({
  processor,
  boundary,
}: {
  processor: Processor;
  boundary: Boundary;
}) => {
  return (
    <Fragment key={processor.name}>
      <ListItem>
        <ListItemText>[Data Product Title] {processor.name}</ListItemText>
      </ListItem>
      <List component="div" sx={{ ml: 2, width: '100%' }}>
        {processor.versions.map((v) => (
          <ProcessorVersionListItem key={v.version} processorVersion={v} boundary={boundary} />
        ))}
      </List>
    </Fragment>
  );
};
