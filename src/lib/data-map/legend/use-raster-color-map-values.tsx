import { createContext, ReactNode, useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { ColorValue } from '@/lib/data-map/legend/GradientLegend';
import { RecoilReadableStateFamily } from '@/lib/recoil/types';

type ColorMapValuesSourceState = RecoilReadableStateFamily<
  ColorValue[],
  { scheme: string; range: [number, number] }
>;

const ColorMapSourceContext = createContext<ColorMapValuesSourceState>(null);

/**
 * Context provider for a source of raster color maps
 */
export function RasterColorMapSourceProvider({
  state,
  children,
}: {
  /** Recoil state family that accepts color map details as param and returns an array of ColorValue */
  state: ColorMapValuesSourceState;
  children?: ReactNode;
}) {
  return <ColorMapSourceContext.Provider value={state}>{children}</ColorMapSourceContext.Provider>;
}

export function useRasterColorMapValues(
  colorScheme: string,
  stretchRange: [number, number],
): ColorValue[] {
  const colorMapValuesState = useContext(ColorMapSourceContext);

  return useRecoilValue(colorMapValuesState({ scheme: colorScheme, range: stretchRange }));
}

// === Categorical schemes - temporary solution until backend is updated ===

const categoricalColorMapStore = new Map<string, ColorValue[]>();

export function registerCategoricalColorScheme(
  categoricalScheme: string,
  colorValues: ColorValue[],
) {
  if (!categoricalColorMapStore.has(categoricalScheme)) {
    categoricalColorMapStore.set(categoricalScheme, colorValues);
  }
}

export function useRasterCategoricalColorMapValues(categoricalScheme: string): ColorValue[] {
  return categoricalColorMapStore.get(categoricalScheme);
}
