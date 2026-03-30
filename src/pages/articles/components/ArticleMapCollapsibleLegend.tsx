import LayersIcon from '@mui/icons-material/Layers';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FC, Suspense, useState } from 'react';

import { useLegendConfigMap } from '@/lib/data-map/legend/legend-config-map';
import { LegendStack } from '@/lib/data-map/legend/LegendStack';
import { ViewLayer } from '@/lib/data-map/view-layers';

/**
 * Bottom-left legend for article maps: collapsed to an icon by default; expands above the button.
 */
export const ArticleMapCollapsibleLegend: FC<{ viewLayers: ViewLayer[] }> = ({ viewLayers }) => {
  const legendConfigs = useLegendConfigMap(viewLayers);
  const [open, setOpen] = useState(false);

  if (!legendConfigs) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column-reverse"
      alignItems="flex-start"
      gap={0.5}
      sx={{
        width: 'fit-content',
        maxWidth: 'min(270px, calc(100vw - 32px))',
        // Let clicks pass through padding/gap; only the button and legend stack capture events.
        pointerEvents: 'none',
      }}
    >
      <Box sx={{ pointerEvents: 'auto' }}>
        <Tooltip title={open ? 'Hide legend' : 'Show legend'}>
          <IconButton
            size="small"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Hide map legend' : 'Show map legend'}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <LayersIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Collapse in={open} timeout="auto">
        <Box sx={{ pointerEvents: 'auto' }}>
          <Suspense fallback={null}>
            <LegendStack legendConfigs={legendConfigs} />
          </Suspense>
        </Box>
      </Collapse>
    </Box>
  );
};
