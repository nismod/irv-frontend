import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { placeSearchQueryState } from './search-state';
import { usePlaceSearch } from './use-place-search';

export const MapSearchField = ({ onSelectedResult }) => {
  const [searchValue, setSearchValue] = useRecoilState(placeSearchQueryState);
  const [searchResultsOpen, setSearchResultsOpen] = useState(true);

  const { loading, searchResults } = usePlaceSearch(searchValue);

  return (
    <Autocomplete
      freeSolo
      openOnFocus
      selectOnFocus
      loading={loading}
      options={loading ? [] : searchResults}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.placeId}>
            {option.label}
          </li>
        );
      }}
      open={searchResultsOpen}
      onOpen={() => setSearchResultsOpen(true)}
      onClose={() => setSearchResultsOpen(false)}
      onChange={(e, value, reason) => {
        // ignore the change if it's because user pressed enter
        if (reason !== 'createOption') {
          onSelectedResult(value);
        }
      }}
      filterOptions={(x) => x}
      inputValue={searchValue}
      onInputChange={(e, value, reason) => {
        /*
        Ignore the change if it's triggered by the user selecting an option.
        When user selects an option, it seems that both a `selectedOption` and a `reset` reason is fired.
        This is so that the actual search query stays in the input field
        */
        if (reason !== 'selectOption' && reason !== 'reset') {
          setSearchValue(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          autoFocus
          variant="standard"
          placeholder="Type place name to search..."
          {...params}
          style={{ width: '300px' }}
        />
      )}
    />
  );
};
