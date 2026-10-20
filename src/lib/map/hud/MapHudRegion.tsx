import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/material/styles';
import type { SystemCssProperties } from '@mui/system';
import React, { ComponentProps, FC, ReactNode } from 'react';

import { eventPreventDefault } from '@/lib/helpers';

const hudRegions = {
  'top-left': {
    sx: {
      top: 0,
      left: 0,
    },
    justifyContent: 'left',
  },
  'top-right': {
    sx: {
      top: 0,
      right: 0,
    },
    justifyContent: 'right',
  },
  'bottom-right': {
    sx: {
      bottom: 0,
      right: 0,
    },
    justifyContent: 'right',
  },
  'bottom-left': {
    sx: {
      bottom: 0,
      left: 0,
    },
    justifyContent: 'left',
  },
};

export interface MapHudProps {
  position: keyof typeof hudRegions;
  sx?: SystemCssProperties<Theme>;
  slotProps?: { stack?: ComponentProps<typeof Stack> };
  children?: ReactNode;
}
export const MapHudRegion: FC<MapHudProps> = ({ position, sx = {}, slotProps, children }) => {
  const { justifyContent, sx: sxDefault } = hudRegions[position];
  const effectiveStyle = {
    ...sxDefault,
    m: 1,
    ...sx,
  };
  return (
    <Box
      // stop interactions with HUD from triggering map events: https://github.com/visgl/deck.gl/discussions/6252
      onPointerUp={eventPreventDefault}
      onMouseMove={eventPreventDefault}
      sx={{
        position: 'absolute',
        pointerEvents: 'auto',
        ...effectiveStyle,
      }}
    >
      <Stack {...slotProps?.stack}>
        {React.Children.map(children, (ch) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: justifyContent,
            }}
          >
            {ch}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
