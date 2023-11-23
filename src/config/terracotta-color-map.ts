import { selectorFamily } from 'recoil';

import { apiClient } from '@/api-client';

const colorMapValuesQuery = selectorFamily({
  key: 'colorMapValuesQuery',
  get: (colorScheme: string) => async () => {
    return await apiClient.colormap.colormapGetColormap({
      colormap: colorScheme,
      stretchRange: '[0,1]',
    });
  },
});

export const terracottaColorMapValuesQuery = selectorFamily({
  key: 'terracottaColorMapValuesQuery',
  get:
    (colorSpec: { scheme: string; range: [number, number] }) =>
    ({ get }) => {
      const values = get(colorMapValuesQuery(colorSpec.scheme));
      const [rangeMin, rangeMax] = colorSpec.range;

      const rangeSize = rangeMax - rangeMin;

      return values.colormap.map(({ value, rgba: [r, g, b] }) => ({
        value: rangeMin + value * rangeSize,
        color: `rgb(${r},${g},${b})`,
      }));
    },
});
