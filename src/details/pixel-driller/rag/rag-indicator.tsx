import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

import { RagStatus } from './rag-types';

interface RagIndicatorProps {
  status: RagStatus;
}

const colorMap: Record<RagStatus, string> = {
  red: '#d84c4c',
  amber: '#e09c6c',
  green: '#d1e587',
  'no-data': '#c8c8c8',
  'not-implemented': '#c8c8c8',
};

const titleMap: Record<RagStatus, string> = {
  red: 'High risk',
  amber: 'Moderate risk',
  green: 'Low risk',
  'no-data': 'No data',
  'not-implemented': 'Not implemented',
};

export const RagIndicator: FC<RagIndicatorProps> = ({ status }) => {
  const tooltipText = titleMap[status];
  return (
    <Tooltip title={tooltipText} placement="top" arrow>
      <IconButton
        size="small"
        aria-label={tooltipText}
        disableRipple
        sx={{
          p: 0,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: colorMap[status],
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

interface RagStatusDisplayProps {
  status: RagStatus;
}

export const RagStatusDisplay: FC<RagStatusDisplayProps> = ({ status }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <RagIndicator status={status} />
      <Typography variant="body2" color="text.secondary">
        Risk assessment: {status}
      </Typography>
    </Box>
  );
};
