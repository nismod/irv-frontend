import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchValue] = useDebounceValue(searchValue, 1500);
  const enabled = Boolean(debouncedSearchValue);

  // return loading=true immediately when search text changes, even before the query is fired off
  useEffect(() => {
    if (searchValue.trim()) {
      setIsSearching(true);
    }
  }, [searchValue]);

  const { data, error, isLoading } = useQuery(
    ['places', debouncedSearchValue],
    () => fetchPlaces(debouncedSearchValue),
    {
      enabled,
      select: processNominatimData, // Transform the response
      onSettled: () => setIsSearching(false),
    },
  );

  return {
    loading: isSearching || isLoading,
    error,
    searchResults: data ?? [],
  };
}
