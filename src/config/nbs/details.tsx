import { List } from '@mui/material';
import { FC } from 'react';

import { DataItem } from '@/lib/ui/data-display/DataItem';

import { DetailHeader, DetailsComponentProps } from '@/details/features/detail-components';

export const NbsDetails: FC<DetailsComponentProps> = ({ f }) => {
  return (
    <>
      <DetailHeader>{f.id}</DetailHeader>
      <List>
        <DataItem label="Land use" value={f.option_landuse} />
        <DataItem label="GADM 0" value={f.GID_0} />
        <DataItem label="GADM 1" value={f.GID_1} />
        <DataItem label="GADM 2" value={f.GID_2} />
        <DataItem label="HYBAS ID" value={f.HYBAS_ID} maximumSignificantDigits={10} />
      </List>
    </>
  );
};
