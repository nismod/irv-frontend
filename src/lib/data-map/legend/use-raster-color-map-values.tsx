import { createContext, useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { ColorValue } from '@/lib/data-map/legend/GradientLegend';
import { RecoilReadableStateFamily } from '@/lib/recoil/types';

const ColorMapSourceContext =
  createContext<
    RecoilReadableStateFamily<ColorValue[], { scheme: string; range: [number, number] }>
  >(null);

export function RasterColorMapSourceProvider({ state, children }) {
  return <ColorMapSourceContext.Provider value={state}>{children}</ColorMapSourceContext.Provider>;
}

export function useRasterColorMapValues(
  colorScheme: string,
  stretchRange: [number, number],
): ColorValue[] {
  const colorMapValuesState = useContext(ColorMapSourceContext);

  return useRecoilValue(colorMapValuesState({ scheme: colorScheme, range: stretchRange }));
}
