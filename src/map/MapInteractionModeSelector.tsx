import { AdsClickOutlined } from '@mui/icons-material';
import ToggleButton from '@mui/material/ToggleButton';
import { useRecoilState } from 'recoil';

import { mapInteractionModeState } from '@/state/map-view/map-interaction-state';

export const MapInteractionModeSelector = () => {
  const [interactionMode, setInteractionMode] = useRecoilState(mapInteractionModeState);
  const selected = interactionMode === 'pixel-driller';

  const handleToggle = () => {
    setInteractionMode((prevValue) =>
      prevValue === 'pixel-driller' ? 'standard' : 'pixel-driller',
    );
  };

  return (
    <ToggleButton
      value="pixel-driller"
      selected={selected}
      onChange={handleToggle}
      aria-label="Toggle site inspection tool"
      title={`Site inspection tool (${selected ? 'click to deactivate' : 'click to activate'})`}
      style={{
        paddingInline: 0,
        backgroundColor: 'white',
        color: 'black',
        minWidth: 'auto',
        width: '40px',
        height: '36px',
        border: '1px solid rgba(0, 0, 0, 0.12)',
      }}
      sx={{
        '&.Mui-selected': {
          backgroundColor: 'white',
          color: 'black',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <AdsClickOutlined color={selected ? 'secondary' : 'inherit'} />
    </ToggleButton>
  );
};
