import { List, Typography } from '@mui/material';
import { ComponentType, FC, ReactNode } from 'react';

import { titleCase } from '@/lib/helpers';
import { DataItem } from '@/lib/ui/data-display/DataItem';

export const DetailHeader: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Typography variant="h6" component="h1">
      {children}
    </Typography>
  );
};

export const DetailSubheader: FC<{ children?: ReactNode }> = ({ children }) => (
  <Typography variant="caption" component="p">
    {children}
  </Typography>
);

export const IdSubheader: FC<{
  id: string;
}> = ({ id }) => (
  <DetailSubheader>
    ID: <span className="asset_id">{id}</span>
  </DetailSubheader>
);

export interface DetailsComponentProps {
  /** A record representing the feature properties */
  f: Record<string, any>;
}

export type DetailsComponentType = ComponentType<DetailsComponentProps>;

export const DefaultDetailsList: FC<DetailsComponentProps> = ({ f }) => {
  return (
    <List>
      {Object.entries(f).map(([key, value]) => (
        <DataItem key={key} label={titleCase(key.replace(/_/g, ' '))} value={value} />
      ))}
    </List>
  );
};

export const DefaultDetails: FC<DetailsComponentProps> = ({ f }) => {
  return (
    <>
      <DetailHeader>Asset</DetailHeader>
      <DefaultDetailsList f={f} />
    </>
  );
};
