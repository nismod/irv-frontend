import { useQuery } from '@tanstack/react-query';
import { useDebounceValue } from 'usehooks-ts';

import { BoundingBox, NominatimBoundingBox, nominatimToAppBoundingBox } from '@/lib/bounding-box';

export interface PlaceSearchResult {
  placeId: number;
  label: string;
  latitude: number;
  longitude: number;
  boundingBox: BoundingBox;
}

interface NominatimSearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: string[];
}

function processNominatimData(data: NominatimSearchResult[]): PlaceSearchResult[] {
  return data?.map((x) => ({
    placeId: x.place_id,
    label: x.display_name,
    latitude: parseFloat(x.lat),
    longitude: parseFloat(x.lon),
    boundingBox: nominatimToAppBoundingBox(x.boundingbox.map(parseFloat) as NominatimBoundingBox),
  }));
}

async function fetchPlaces(searchValue: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=${searchValue}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }
  return response.json();
}

export function usePlaceSearch(searchValue: string) {
  const trimmedValue = searchValue.trim();
  let [debouncedSearchValue] = useDebounceValue(trimmedValue, 1500);

  // propagate empty search value immediately, bypassing the debounce
  if (!trimmedValue) {
    debouncedSearchValue = '';
  }

  const isDebouncing = trimmedValue && trimmedValue !== debouncedSearchValue;

  const { data, error, isFetching } = useQuery({
    queryKey: ['places', debouncedSearchValue],
    queryFn: () => fetchPlaces(debouncedSearchValue),
    enabled: !!debouncedSearchValue,
    select: processNominatimData, // Transform the response
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    // return loading=true if the search value has changed, even before the query is sent
    loading: isDebouncing || isFetching,
    error,
    searchResults: data ?? [],
  };
}
