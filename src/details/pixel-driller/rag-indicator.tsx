import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

export type RagStatus = 'red' | 'amber' | 'green' | 'no-data' | 'not-implemented';

interface RagIndicatorProps {
  status: RagStatus;
}

export const RagIndicator: FC<RagIndicatorProps> = ({ status }) => {
  const colorMap: Record<RagStatus, string> = {
    red: '#d32f2f',
    amber: '#ed6c02',
    green: '#2e7d32',
    'no-data': '#9e9e9e',
    'not-implemented': '#9e9e9e',
  };

  const titleMap: Record<RagStatus, string> = {
    red: 'High risk',
    amber: 'Moderate risk',
    green: 'Low risk',
    'no-data': 'No data',
    'not-implemented': 'Not implemented',
  };

  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: colorMap[status],
        border: '1px solid rgba(0, 0, 0, 0.1)',
        flexShrink: 0,
      }}
      title={titleMap[status]}
    />
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
