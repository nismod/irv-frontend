import { atom, Provider } from 'jotai';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { ColorValue } from '@/lib/data-map/legend/GradientLegend';
import {
  RasterColorMapSourceProvider,
  registerCategoricalColorScheme,
} from '@/lib/data-map/legend/use-raster-color-map-values';
import { makeValueFormat, nullFormat, type FormatFunction } from '@/lib/formats';

import { RasterHoverDescription } from './RasterHoverDescription';

function renderContinuous(
  palette: ColorValue[],
  color: [number, number, number, number],
  formatValue: FormatFunction = makeValueFormat('_m', { maximumFractionDigits: 1 }),
  rangeTruncated: [boolean, boolean] = [false, false],
) {
  const colors = atom(palette);
  const markup = renderToStaticMarkup(
    <Provider>
      <RasterColorMapSourceProvider atomFamily={() => colors}>
        <RasterHoverDescription
          colorMap={{ type: 'continuous', scheme: 'test', range: [0, 5], rangeTruncated }}
          color={color}
          label="Flood depth"
          formatValue={formatValue}
        />
      </RasterColorMapSourceProvider>
    </Provider>,
  );
  return markup.replace(/<[^>]+>/g, '');
}

const palette = [
  { value: 1.18, color: 'rgb(1,1,1)' },
  { value: 1.2, color: 'rgb(2,2,2)' },
  { value: 1.22, color: 'rgb(3,3,3)' },
];

describe('raster hover ranges', () => {
  it('shows a narrow approximate interval instead of collapsing to one-decimal endpoints', () => {
    expect(renderContinuous(palette, [2, 2, 2, 255])).toContain('≈ 1.19–1.21m');
  });

  it('preserves range formatting through nullFormat wrappers', () => {
    const format = nullFormat(makeValueFormat('_ min', { maximumFractionDigits: 0 }));
    expect(renderContinuous(palette, [2, 2, 2, 255], format)).toContain('1.19–1.21 min');
  });

  it('formats percentage ranges at the appropriate display precision', () => {
    const colors = palette.map((entry) => ({ ...entry, value: entry.value / 100 }));
    const format = makeValueFormat('_', { style: 'percent', maximumFractionDigits: 0 });
    const text = renderContinuous(colors, [2, 2, 2, 255], format);
    expect(text).toContain('1.19%–1.21%');
  });

  it('preserves rich units once for the whole range', () => {
    const format = makeValueFormat((value) => (
      <>
        {value}/km<sup>2</sup>
      </>
    ));
    expect(renderContinuous(palette, [2, 2, 2, 255], format)).toContain('1.19–1.21/km2');
  });

  it('shows open-ended intervals for clipped endpoint colors', () => {
    expect(renderContinuous(palette, [1, 1, 1, 255], undefined, [true, false])).toContain('≤1.19m');
    expect(renderContinuous(palette, [3, 3, 3, 255], undefined, [false, true])).toContain('≥1.21m');
  });

  it('shows no numeric estimate for an unrecognized color', () => {
    expect(renderContinuous(palette, [99, 99, 99, 255])).not.toContain('≈');
  });

  it('keeps categorical labels exact', () => {
    registerCategoricalColorScheme('tooltip-range-test', [{ color: 'rgb(1,2,3)', value: 4 }]);
    const text = renderToStaticMarkup(
      <RasterHoverDescription
        colorMap={{ type: 'categorical', scheme: 'tooltip-range-test' }}
        color={[1, 2, 3, 255]}
        label="Land cover"
        formatValue={() => 'Forest'}
      />,
    );
    expect(text).toContain('Forest');
    expect(text).not.toContain('≈');
  });
});
