import { List } from '@mui/material';
import { Boundary, Processor } from '@nismod/irv-autopkg-client';
import { FC } from 'react';

import { ProcessorListItem } from './ProcessorListItem';

export const DatasetsList: FC<{ datasets: Processor[]; region: Boundary }> = ({
  datasets,
  region,
}) => {
  return (
    <List sx={{ width: '100%' }}>
      {datasets.map((ds) => (
        <ProcessorListItem key={ds.name} processor={ds} boundary={region} />
      ))}
    </List>
  );
};
