import Box from '@mui/material/Box';
import { useEffect, useMemo, useRef } from 'react';
import { useVegaEmbed } from 'react-vega';
import { VisualizationSpec } from 'vega-embed';

// Tableau10 palette (copy of Vega's categorical palette)
const TABLEAU10 = [
  '#4e79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9d9a',
  '#9c755f',
  '#bab0ac',
];

export function useColorDomainAndRange(
  data: Record<string, any>[],
  colorField: string | undefined,
): [string[] | undefined, string[] | undefined] {
  // Compute colour domain/range for series. Baseline should already be present as a distinct
  // value in the colour field (e.g. rcp = 'baseline'), so we treat it as the first category
  // and map it to gray, with other series drawn from the Tableau10 palette.
  return useMemo<[string[] | undefined, string[] | undefined]>(() => {
    if (!colorField) return [undefined, undefined];

    const values = Array.from(
      new Set(data.map((d) => d[colorField]).filter((v): v is string => v != null)),
    );

    if (values.length === 0) {
      return [undefined, undefined];
    }

    // Move baseline to the front if present
    const baselineIndex = values.indexOf('baseline');
    if (baselineIndex > -1) {
      values.splice(baselineIndex, 1);
      values.unshift('baseline');
    }

    const domain = values;
    const nonBaseline = domain.filter((v) => v !== 'baseline');

    const nonBaselineColors = nonBaseline.map((_v, idx) => TABLEAU10[idx % TABLEAU10.length]);

    const range =
      domain[0] === 'baseline' ? ['#999999', ...nonBaselineColors] : [...nonBaselineColors];

    return [domain, range];
  }, [data, colorField]);
}

interface VegaChartProps {
  spec: VisualizationSpec;
  data: Record<string, any>[];
  width: number;
  height: number;
}

export function VegaChart({ spec, data, width, height }: VegaChartProps) {
  const vegaRef = useRef<HTMLDivElement>(null);
  const embed = useVegaEmbed({
    spec,
    options: {
      width,
      height,
      actions: false,
      renderer: 'svg',
      config: {
        autosize: {
          resize: true,
        },
      },
    },
    ref: vegaRef,
  });

  useEffect(() => {
    embed?.view.data('values', data).runAsync();
  }, [embed, data]);

  return (
    <Box>
      <div ref={vegaRef} />
    </Box>
  );
}
