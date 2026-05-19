import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useAtom } from 'jotai';

import { MapSearchField } from './MapSearchField';
import { placeSearchActiveAtom } from './search-state';

const blankSpaceWidth = 8;

export const MapSearch = ({ onSelectedResult }) => {
  const [expanded, setExpanded] = useAtom(placeSearchActiveAtom);

  return (
    <ClickAwayListener onClickAway={(e) => setExpanded(false)}>
      <Box style={{ display: 'inline-flex' }}>
        {/* display: inline-flex causes box to shrink to contents */}
        <Paper elevation={1}>
          <Box
            style={{ display: 'flex', flexDirection: 'row' }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setExpanded(false);
              }
            }}
          >
            <IconButton
              title="Search"
              onClick={() => setExpanded(!expanded)}
              style={{
                paddingInline: blankSpaceWidth,
                paddingBlock: blankSpaceWidth - 2,
                backgroundColor: 'white',
                color: 'black',
              }}
              size="large"
            >
              <SearchIcon />
            </IconButton>
            {expanded && (
              <Box style={{ marginRight: blankSpaceWidth }}>
                <MapSearchField onSelectedResult={onSelectedResult} />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </ClickAwayListener>
  );
};
