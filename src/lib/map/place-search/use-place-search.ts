import { useDebounceCallback } from '@react-hook/debounce';
import { useEffect, useState } from 'react';
import { useFetch } from 'use-http';

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

export function usePlaceSearch(searchValue: string) {
  const { get, error } = useFetch(
    `https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=${searchValue}`,
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const debouncedGet = useDebounceCallback(async () => {
    try {
      const data = await get();
      setData(data);
    } finally {
      setLoading(false);
    }
  }, 1500);

  useEffect(() => {
    if (searchValue !== '') {
      setLoading(true);
      debouncedGet();
    }
  }, [searchValue, debouncedGet]);

  const searchResults: PlaceSearchResult[] = processNominatimData(data) ?? [];

  return {
    loading,
    error,
    searchResults,
  };
}
