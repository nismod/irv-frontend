import { useMemo } from 'react';
import { VisualizationSpec } from 'vega-embed';

import { ChartConfig, KeyField, ReturnPeriodRow } from '../types';
import { useColorDomainAndRange, VegaChart } from './vega-chart';

export const makeReturnPeriodDetailedSpec = (
  rpValues: number[],
  config: ChartConfig,
  colorDomain?: string[],
  colorRange?: string[],
): VisualizationSpec => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  autosize: {
    type: 'fit',
    contains: 'padding',
  },
  data: {
    name: 'values',
  },
  layer: [
    {
      mark: {
        type: 'line',
        point: {
          filled: true,
        },
        tooltip: true,
      },
      encoding: {
        x: {
          field: 'rp',
          type: 'quantitative',
          title: 'Return period (years)',
          scale: {
            type: 'log',
          },
          axis: {
            gridDash: [2, 2],
            domainColor: '#ccc',
            tickColor: '#ccc',
            values: rpValues,
          },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: config.yLabel,
          axis: {
            gridDash: [2, 2],
            domainColor: '#ccc',
            tickColor: '#ccc',
          },
        },
        // Colour and series encodings are driven by per-domain config
        // Baseline is represented as a dedicated value in the colour field and
        // mapped to gray via the explicit scale range.
        ...(config.colorField && {
          color: {
            field: config.colorField,
            type: 'nominal',
            title: config.colorField,
            scale:
              colorDomain && colorRange
                ? {
                    domain: colorDomain,
                    range: colorRange,
                  }
                : undefined,
            legend: {
              orient: 'bottom',
              direction: 'horizontal',
            },
          },
        }),
        ...(config.seriesFields.length > 0 && {
          detail: {
            field: 'scenario',
            type: 'nominal',
          },
        }),
        tooltip: [
          { field: 'value', type: 'quantitative', format: ',.3r', title: 'value' },
          { field: 'rp', type: 'quantitative', title: 'rp' },
          // Include each distinct field that participates in series or colour, so
          // the tooltip automatically stays in sync with config.
          ...Array.from(
            new Set([...config.seriesFields, config.colorField].filter(Boolean) as KeyField[]),
          ).map((field) => ({
            field,
            type: 'nominal' as const,
            title: field,
          })),
          { field: 'domain', type: 'nominal' as const, title: 'domain' },
        ],
      },
    },
  ],
});

interface ReturnPeriodDetailedChartProps {
  data: ReturnPeriodRow[];
  config: ChartConfig;
  width: number;
  height: number;
}

export function ReturnPeriodDetailedChart({
  data,
  config,
  width,
  height,
}: ReturnPeriodDetailedChartProps) {
  const [colorDomain, colorRange] = useColorDomainAndRange(data, config.colorField);
  const rpValues = useMemo(
    () => Array.from(new Set(data.map((d) => d.rp))).sort((a, b) => a - b),
    [data],
  );
  const spec = useMemo(
    () => makeReturnPeriodDetailedSpec(rpValues, config, colorDomain, colorRange),
    [rpValues, config, colorDomain, colorRange],
  );

  return <VegaChart spec={spec} data={data} width={width} height={height} />;
}
