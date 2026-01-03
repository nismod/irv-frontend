import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

export type RagStatus = 'red' | 'amber' | 'green';

interface RagIndicatorProps {
  status: RagStatus;
}

const RagIndicator: FC<RagIndicatorProps> = ({ status }) => {
  const colorMap = {
    red: '#d32f2f',
    amber: '#ed6c02',
    green: '#2e7d32',
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
      title={`Risk status: ${status}`}
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
