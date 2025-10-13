import LayersIcon from '@mui/icons-material/Layers';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

import { backgroundState, showLabelsState } from './layers-state';

export const MapLayerSelection = () => {
  const [showPopover, setShowPopover] = useState(false);

  const [background, setBackground] = useRecoilState(backgroundState);
  const [showLabels, setShowLabels] = useRecoilState(showLabelsState);

  const other = background === 'satellite' ? 'light' : 'satellite';

  const handleBackground = useCallback(
    (e, newBackground) => {
      // when user presses the currently active option
      if (newBackground == null) {
        // toggle to the other option
        setBackground(other);
      } else {
        setBackground(newBackground);
      }
    },
    [setBackground, other],
  );

  const buttonStyle = showPopover ? { borderTopRightRadius: 0, borderBottomRightRadius: 0 } : {};
  return (
    <ClickAwayListener onClickAway={() => setShowPopover(false)}>
      <div
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        style={{ display: 'flex' }}
      >
        <Button
          aria-label="Toggle map background"
          aria-owns={showPopover ? 'map-layers-popover' : undefined}
          aria-haspopup="true"
          variant="contained"
          style={{
            paddingInline: 0,
            backgroundColor: 'white',
            color: 'black',
            minWidth: 'auto',
            width: '40px',
            height: '36px',
            ...buttonStyle,
          }}
          onClick={() => setShowPopover((showPopover) => !showPopover)}
        >
          <LayersIcon />
        </Button>
        {showPopover && (
          <Paper id="map-layers-popover" style={{ overflow: 'hidden', borderTopLeftRadius: 0 }}>
            <Box width={220}>
              <Box px={2} py="6px" height={37} display="flex" borderBottom="1px solid #ddd">
                <ToggleButtonGroup
                  exclusive
                  color="primary"
                  value={background}
                  onChange={handleBackground}
                  fullWidth
                >
                  <ToggleButton value="light">Map</ToggleButton>
                  <ToggleButton value="satellite">Satellite</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box px={2}>
                <Box>
                  <FormControlLabel
                    label="Show labels"
                    control={
                      <Checkbox
                        checked={showLabels}
                        onChange={(e, checked) => setShowLabels(checked)}
                      />
                    }
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
};
