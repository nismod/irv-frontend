import { useAtomValue } from 'jotai';
import type { Atom } from 'jotai';
import { createContext, ReactNode, useContext } from 'react';

import { ColorValue } from '@/lib/data-map/legend/GradientLegend';

type ColorMapValuesAtomFamily = (param: {
  scheme: string;
  range: [number, number];
}) => Atom<ColorValue[] | Promise<ColorValue[]>>;

const ColorMapSourceContext = createContext<ColorMapValuesAtomFamily>(null);

/**
 * Context provider for a source of raster color maps
 */
export function RasterColorMapSourceProvider({
  atomFamily,
  children,
}: {
  /** Atom family that accepts color map details as param and returns ColorValue[] */
  atomFamily: ColorMapValuesAtomFamily;
  children?: ReactNode;
}) {
  return (
    <ColorMapSourceContext.Provider value={atomFamily}>{children}</ColorMapSourceContext.Provider>
  );
}

export function useRasterContinuousColorMapValues(
  colorScheme: string,
  stretchRange: [number, number],
): ColorValue[] {
  const colorMapValuesAtomFamily = useContext(ColorMapSourceContext);

  return useAtomValue(colorMapValuesAtomFamily({ scheme: colorScheme, range: stretchRange }));
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
