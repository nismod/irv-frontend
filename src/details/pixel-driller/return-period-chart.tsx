import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import _ from 'lodash';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useVegaEmbed } from 'react-vega';
import { VisualizationSpec } from 'vega-embed';

import { ChartConfig, KeyField, ReturnPeriodRow } from './types';

export interface ReturnPeriodChartProps {
  config: ChartConfig;
  data: ReturnPeriodRow[];
}

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

export const ReturnPeriodChart: FC<ReturnPeriodChartProps> = ({ config, data }) => {
  // Detect simple case: no epochs, no series fields, no color field (e.g., JRC flooding)
  const isSimpleCase = useMemo(() => {
    const hasEpochs = data.some((d) => d.epoch != null);
    return !hasEpochs && config.seriesFields.length === 0 && !config.colorField;
  }, [data, config]);

  // Extract and sort epochs (baseline first, then ascending)
  const availableEpochs = useMemo(() => {
    const epochs = Array.from(new Set(data.map((d) => d.epoch).filter(Boolean) as string[]));
    const baseline = epochs.filter((e) => e === 'baseline' || e === 'present');
    const years = epochs
      .filter((e) => e !== 'baseline' && e !== 'present')
      .map((e) => Number(e))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b)
      .map((n) => String(n));
    return [...baseline, ...years];
  }, [data]);

  const [selectedEpoch, setSelectedEpoch] = useState<string | null>(
    availableEpochs.length > 0 ? availableEpochs[0] : null,
  );

  // Filter data by selected epoch, and add baseline for comparison when non-baseline is selected
  // For simple cases (no epochs), just return all data without filtering
  const filteredData = useMemo(() => {
    // Simple case: no epoch filtering needed
    if (isSimpleCase) return data;

    if (!selectedEpoch) return data;

    const isBaseline = selectedEpoch === 'baseline' || selectedEpoch === 'present';
    const selectedData = data.filter((d) => d.epoch === selectedEpoch);

    if (isBaseline) {
      return selectedData;
    }

    // For non-baseline epochs, also include baseline data for comparison
    const baselineData = data.filter((d) => d.epoch === 'baseline' || d.epoch === 'present');

    return [...selectedData, ...baselineData];
  }, [data, selectedEpoch, isSimpleCase]);

  // For simple cases (no epochs, no series fields, no color field), always use detailed mode
  const effectiveMode = isSimpleCase ? 'detailed' : 'grouped-by-pathway';

  const tableData = useMemo(() => _.cloneDeep(filteredData), [filteredData]);

  const hasLegend = Boolean(config.colorField);
  // Aim for the plot area to be roughly square. We can't easily read the
  // container width inside Vega-Lite, so we approximate using a fixed height,
  // and make it a bit taller when a legend is present (since the legend eats
  // some vertical space from the plot area).
  const chartHeight = hasLegend ? 450 : 400;

  return (
    <Box>
      {availableEpochs.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <ButtonGroup size="small" variant="outlined">
            {availableEpochs.map((epoch) => (
              <Button
                key={epoch}
                variant={selectedEpoch === epoch ? 'contained' : 'outlined'}
                onClick={() => setSelectedEpoch(epoch)}
              >
                {epoch}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      )}
      <Box sx={{ width: '100%' }}>
        {effectiveMode === 'detailed' ? (
          <ReturnPeriodDetailedChart
            data={tableData}
            config={config}
            width={400}
            height={chartHeight}
          />
        ) : (
          <ReturnPeriodGroupedByPathwayChart
            data={tableData}
            config={config}
            width={400}
            height={chartHeight}
          />
        )}
      </Box>
    </Box>
  );
};

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

function ReturnPeriodDetailedChart({
  data,
  config,
  width,
  height,
}: {
  data: ReturnPeriodRow[];
  config: ChartConfig;
  width: number;
  height: number;
}) {
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

function makeReturnPeriodGroupedByPathwaySpec(
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
    layer: [
      {
        mark: {
          type: 'area',
          opacity: 0.15,
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
            field: 'value_min',
            type: 'quantitative',
            title: config.yLabel,
          },
          y2: {
            field: 'value_max',
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
            { field: 'value_min', type: 'quantitative', format: ',.3r', title: 'min' },
            { field: 'value_max', type: 'quantitative', format: ',.3r', title: 'max' },
            { field: 'rp', type: 'quantitative', title: 'rp' },
            { field: config.colorField, type: 'nominal', title: config.colorField },
          ],
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
            { field: 'value', type: 'quantitative', format: ',.3r', title: 'median' },
            { field: 'rp', type: 'quantitative', title: 'rp' },
            { field: config.colorField, type: 'nominal', title: config.colorField },
          ],
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

function ReturnPeriodGroupedByPathwayChart({
  data,
  config,
  width,
  height,
}: {
  data: ReturnPeriodRow[];
  config: ChartConfig;
  width: number;
  height: number;
}) {
  const groupedData = useMemo(() => {
    const colorField = config.colorField;
    if (!data.length || !colorField) return [];
    const grouped = _.groupBy(data, (d) => {
      const pathwayValue = d[colorField];
      return `${pathwayValue || 'unknown'}_${d.rp}`;
    });
    const rows: ReturnPeriodGroupedRow[] = [];

    for (const [key, rowsForGroup] of Object.entries(grouped)) {
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

function useColorDomainAndRange(data: Record<string, any>[], colorField: string) {
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

function VegaChart({
  spec,
  data,
  width,
  height,
}: {
  spec: VisualizationSpec;
  data: Record<string, any>[];
  width: number;
  height: number;
}) {
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
