import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FC } from 'react';

import { isNumeric, numFormat } from '@/lib/helpers';

export interface DataItemProps {
  label: string;
  value: any;
  maximumSignificantDigits?: number;
}

export const DataItem: FC<DataItemProps> = ({ label, value, maximumSignificantDigits }) => {
  if (isNumeric(value)) {
    value = numFormat(value, maximumSignificantDigits);
  }
  return (
    <ListItem disableGutters disablePadding>
      <ListItemText
        primary={label}
        primaryTypographyProps={{ variant: 'caption' }}
        secondary={value === ' ' ? '-' : value || '-'}
      />
    </ListItem>
  );
};
