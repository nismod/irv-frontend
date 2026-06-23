import isDeepEqual from 'fast-deep-equal';
import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import { apiClient } from '@/api-client';

const colorMapValuesQueryAtomFamily = atomFamily((colorScheme: string) =>
  atom(async () => {
    return await apiClient.colormap.colormapGetColormap({
      colormap: colorScheme,
      stretchRange: '[0,1]',
    });
  }),
);

export const terracottaColorMapValuesQueryAtomFamily = atomFamily(
  (colorSpec: { scheme: string; range: [number, number] }) =>
    atom(async (get) => {
      const values = await get(colorMapValuesQueryAtomFamily(colorSpec.scheme));
      const [rangeMin, rangeMax] = colorSpec.range;

      const rangeSize = rangeMax - rangeMin;

      return values.colormap.map(({ value, rgba: [r, g, b] }) => ({
        value: rangeMin + value * rangeSize,
        color: `rgb(${r},${g},${b})`,
      }));
    }),
  isDeepEqual,
);
