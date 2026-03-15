import _ from 'lodash';
import { useMemo } from 'react';
import { VisualizationSpec } from 'vega-embed';

import { ChartConfig, ReturnPeriodRow } from '../types';
import { useColorDomainAndRange, VegaChart } from './vega-chart';

export function makeReturnPeriodGroupedByPathwaySpec(
  rpValues: number[],
  config: ChartConfig,
  colorDomain?: string[],
  colorRange?: string[],
): VisualizationSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    autosize: {
      type: 'fit',
      contains: 'padding',
    },
    data: {
      name: 'values',
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
      tooltip: [
        { field: config.colorField, type: 'nominal', title: config.colorField },
        { field: 'rp', type: 'quantitative', title: 'Return period' },
        { field: 'value', type: 'quantitative', format: ',.3r', title: 'Median' },
        { field: 'value_min', type: 'quantitative', format: ',.3r', title: 'Min' },
        { field: 'value_max', type: 'quantitative', format: ',.3r', title: 'Max' },
      ],
    },
    layer: [
      {
        mark: {
          type: 'area',
          opacity: 0.15,
        },
        encoding: {
          y: {
            field: 'value_min',
            type: 'quantitative',
            title: config.yLabel,
          },
          y2: {
            field: 'value_max',
          },
        },
      },
      {
        mark: {
          type: 'line',
          point: {
            filled: true,
          },
          tooltip: true,
        },
        encoding: {
          y: {
            field: 'value',
            type: 'quantitative',
            title: config.yLabel,
          },
        },
      },
    ],
  };
}

interface ReturnPeriodGroupedRow {
  rp: number;
  value: number;
  value_min: number;
  value_max: number;
  [key: string]: string | number | undefined;
}

interface ReturnPeriodGroupedByPathwayChartProps {
  data: ReturnPeriodRow[];
  config: ChartConfig;
  width: number;
  height: number;
}

export function ReturnPeriodGroupedByPathwayChart({
  data,
  config,
  width,
  height,
}: ReturnPeriodGroupedByPathwayChartProps) {
  const groupedData = useMemo(() => {
    const colorField = config.colorField;
    if (!data.length || !colorField) return [];
    const grouped = _.groupBy(data, (d) => {
      const pathwayValue = d[colorField];
      return `${pathwayValue || 'unknown'}_${d.rp}`;
    });
    const rows: ReturnPeriodGroupedRow[] = [];

    for (const [, rowsForGroup] of Object.entries(grouped)) {
      const values = rowsForGroup.map((r) => r.value).filter((v) => v != null);
      if (!values.length) continue;

      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

      const firstRow = rowsForGroup[0];
      const pathwayValue = firstRow[colorField];

      rows.push({
        rp: firstRow.rp,
        value: median,
        value_min: sorted[0],
        value_max: sorted[sorted.length - 1],
        [colorField]: pathwayValue,
      });
    }

    return rows;
  }, [data, config.colorField]);

  const [colorDomain, colorRange] = useColorDomainAndRange(groupedData, config.colorField);

  const rpValues = useMemo(
    () => Array.from(new Set(groupedData.map((d) => d.rp))).sort((a, b) => a - b),
    [groupedData],
  );

  const spec = useMemo(
    () => makeReturnPeriodGroupedByPathwaySpec(rpValues, config, colorDomain, colorRange),
    [rpValues, config, colorDomain, colorRange],
  );

  return <VegaChart spec={spec} data={groupedData} width={width} height={height} />;
}
