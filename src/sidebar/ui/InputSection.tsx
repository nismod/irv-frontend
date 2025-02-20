import { Box, BoxProps } from '@mui/material';
import { FC } from 'react';

export interface InputSectionProps extends BoxProps {}
export const InputSection: FC<InputSectionProps> = ({ ...props }) => (
  <Box mb={2} flexGrow={1} width="100%" {...props} />
);
