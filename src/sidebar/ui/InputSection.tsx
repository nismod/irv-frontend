import Box, { BoxProps } from '@mui/material/Box';
import { FC } from 'react';

export interface InputSectionProps extends BoxProps {}
export const InputSection: FC<InputSectionProps> = ({ ...props }) => (
  <Box
    {...props}
    sx={[
      {
        mb: 2,
        flexGrow: 1,
        width: '100%',
      },
      ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
    ]}
  />
);
