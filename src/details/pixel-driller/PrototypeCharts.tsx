import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import { VegaLite } from 'react-vega';

type PixelDomain = 'aqueduct' | 'jrc_flood' | string;

interface PixelRecordKeys {
  // NOTE: different domains expose different keys; keep these optional
  hazard?: string;
  rp?: string;
  rcp?: string;
  epoch?: string;
  gcm?: string;
  ssp?: string;
  metric?: string;
  impact_model?: string;
  subtype?: string;
}

interface PixelRecord {
  value: number | null;
  layer: {
    domain: PixelDomain;
    keys: PixelRecordKeys;
    id: string;
  };
}

interface PixelResponse {
  point: {
    lat: number;
    lon: number;
  };
  results: PixelRecord[];
}

type ReturnPeriodRow = {
  rp: number;
  value: number;
  rcp?: string;
  epoch?: string;
  gcm?: string;
  ssp?: string;
  scenario: string;
  domain: PixelDomain;
  hazard?: string;
  isBaselineComparison?: boolean; // True when this is baseline data shown for comparison
};

type KeyField = keyof PixelRecordKeys | 'domain';

interface ChartConfig {
  id: string;
  title: string;
  xLabel: string;
  yLabel: string;
  /** Fields that together define the logical “scenario” / series */
  seriesFields: KeyField[];
  /** Which field to use for colour (e.g. rcp or ssp). Optional. */
  colorField?: KeyField;
}

const asPixelResponse = (data: unknown): PixelResponse => data as PixelResponse;

const makeReturnPeriodSpec = (rpValues: number[], config: ChartConfig) => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 'container',
  autosize: {
    type: 'fit',
    contains: 'padding',
  },
  data: {
    name: 'table',
  },
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
      title: 'Value',
      axis: {
        gridDash: [2, 2],
        domainColor: '#ccc',
        tickColor: '#ccc',
      },
    },
    // Colour and series encodings are driven by per-domain config
    // Use gray for baseline comparison, otherwise use colorField
    ...(config.colorField && {
      color: {
        condition: {
          test: 'datum.isBaselineComparison === true',
          value: '#999999',
        },
        field: config.colorField,
        type: 'nominal',
        title: config.colorField,
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
});

interface ReturnPeriodChartProps {
  config: ChartConfig;
  data: ReturnPeriodRow[];
}

const buildSubtitle = (config: ChartConfig): string => {
  const parts: string[] = [];
  parts.push(`X: ${config.xLabel}`);
  parts.push(`Y: ${config.yLabel}`);

  if (config.seriesFields.length > 0) {
    parts.push(`Series: ${config.seriesFields.join(' + ')}`);
  }

  if (config.colorField) {
    parts.push(`Colour: ${config.colorField}`);
  }

  return parts.join(', ');
};

// Helper to get field value from a row
const getFieldValueFromRow = (row: ReturnPeriodRow, field: KeyField): string | undefined => {
  if (field === 'domain') return row.domain;
  if (field === 'rcp') return row.rcp;
  if (field === 'ssp') return row.ssp;
  if (field === 'epoch') return row.epoch;
  if (field === 'gcm') return row.gcm;
  return undefined;
};

const ReturnPeriodChart: FC<ReturnPeriodChartProps> = ({ config, data }) => {
  const [mode, setMode] = useState<'detailed' | 'aggregated' | 'grouped-by-pathway'>('detailed');

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
  const filteredData = useMemo(() => {
    if (!selectedEpoch) return data;

    const isBaseline = selectedEpoch === 'baseline' || selectedEpoch === 'present';
    const selectedData = data.filter((d) => d.epoch === selectedEpoch);

    if (isBaseline) {
      return selectedData;
    }

    // For non-baseline epochs, also include baseline data in gray
    const baselineData = data
      .filter((d) => d.epoch === 'baseline' || d.epoch === 'present')
      .map((d) => ({ ...d, isBaselineComparison: true }));

    return [...selectedData, ...baselineData];
  }, [data, selectedEpoch]);

  const aggregatedData = useMemo(() => {
    if (!filteredData.length) return [];
    const grouped = _.groupBy(filteredData, (d) => d.rp);
    const rows: Array<{ rp: number; value: number; value_min: number; value_max: number }> = [];

    for (const [rpKey, rowsForRp] of Object.entries(grouped)) {
      const values = rowsForRp.map((r) => r.value).filter((v) => v != null);
      if (!values.length) continue;

      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

      rows.push({
        rp: Number(rpKey),
        value: median,
        value_min: sorted[0],
        value_max: sorted[sorted.length - 1],
      });
    }

    return rows;
  }, [filteredData]);

  // Group by pathway (colorField), rp, and isBaselineComparison, then aggregate within each group
  const groupedByPathwayData = useMemo(() => {
    if (!filteredData.length || !config.colorField) return [];
    const colorField = config.colorField;
    const grouped = _.groupBy(filteredData, (d) => {
      const pathwayValue = getFieldValueFromRow(d, colorField);
      const isBaseline = d.isBaselineComparison ? 'baseline' : 'main';
      return `${pathwayValue || 'unknown'}_${d.rp}_${isBaseline}`;
    });
    const rows: Array<{
      rp: number;
      value: number;
      value_min: number;
      value_max: number;
      isBaselineComparison?: boolean;
      [key: string]: string | number | boolean | undefined;
    }> = [];

    for (const [key, rowsForGroup] of Object.entries(grouped)) {
      const values = rowsForGroup.map((r) => r.value).filter((v) => v != null);
      if (!values.length) continue;

      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

      const firstRow = rowsForGroup[0];
      const pathwayValue = getFieldValueFromRow(firstRow, colorField);

      rows.push({
        rp: firstRow.rp,
        value: median,
        value_min: sorted[0],
        value_max: sorted[sorted.length - 1],
        isBaselineComparison: firstRow.isBaselineComparison,
        [colorField]: pathwayValue,
      });
    }

    return rows;
  }, [filteredData, config.colorField]);

  const currentTable =
    mode === 'aggregated'
      ? aggregatedData
      : mode === 'grouped-by-pathway'
        ? groupedByPathwayData
        : filteredData;

  const tableData = useMemo(
    () => ({
      table: _.cloneDeep(currentTable),
    }),
    [currentTable],
  );

  const rpValues = useMemo(
    () => Array.from(new Set(currentTable.map((d) => d.rp))).sort((a, b) => a - b),
    [currentTable],
  );

  const detailedSpec = useMemo(() => makeReturnPeriodSpec(rpValues, config), [rpValues, config]);

  const aggregatedSpec = useMemo(
    () => ({
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      autosize: {
        type: 'fit',
        contains: 'padding',
      },
      data: {
        name: 'table',
      },
      layer: [
        {
          mark: {
            type: 'area',
            opacity: 0.2,
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
            tooltip: [
              { field: 'value_min', type: 'quantitative', format: ',.3r', title: 'min' },
              { field: 'value_max', type: 'quantitative', format: ',.3r', title: 'max' },
              { field: 'rp', type: 'quantitative', title: 'rp' },
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
          },
        },
      ],
    }),
    [config.yLabel, rpValues],
  );

  const groupedByPathwaySpec = useMemo(
    () => ({
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      autosize: {
        type: 'fit',
        contains: 'padding',
      },
      data: {
        name: 'table',
      },
      layer: [
        {
          mark: {
            type: 'area',
            opacity: 0.3,
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
              condition: {
                test: 'datum.isBaselineComparison === true',
                value: '#999999',
              },
              field: config.colorField,
              type: 'nominal',
              title: config.colorField,
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
              condition: {
                test: 'datum.isBaselineComparison === true',
                value: '#999999',
              },
              field: config.colorField,
              type: 'nominal',
              title: config.colorField,
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
    }),
    [config.yLabel, config.colorField, rpValues],
  );

  const spec =
    mode === 'aggregated'
      ? aggregatedSpec
      : mode === 'grouped-by-pathway'
        ? groupedByPathwaySpec
        : detailedSpec;

  const subtitle = buildSubtitle(config);

  const hasLegend = Boolean(config.colorField);
  // Aim for the plot area to be roughly square. We can't easily read the
  // container width inside Vega-Lite, so we approximate using a fixed height,
  // and make it a bit taller when a legend is present (since the legend eats
  // some vertical space from the plot area).
  const chartHeight = hasLegend ? 450 : 400;

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 1 }}
      >
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={mode}
          exclusive
          onChange={(_, value) => {
            if (value) setMode(value);
          }}
        >
          <ToggleButton value="detailed">Detailed</ToggleButton>
          <ToggleButton value="aggregated">Aggregated</ToggleButton>
          {config.colorField && <ToggleButton value="grouped-by-pathway">By Pathway</ToggleButton>}
        </ToggleButtonGroup>
      </Stack>
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
      <Box sx={{ width: '100%', height: chartHeight }}>
        <VegaLite
          data={tableData}
          spec={spec as any}
          actions={false}
          width={400}
          height={chartHeight}
          //   style={{ width: '100%', height: chartHeight }}
        />
      </Box>
    </Box>
  );
};

const getFieldValue = (record: PixelRecord, field: KeyField): string | undefined => {
  if (field === 'domain') return record.layer.domain;
  const value = record.layer.keys[field];
  return value == null ? undefined : String(value);
};

/**
 * Helper to map raw pixel records into chart rows for the prototype.
 * This is intentionally light-weight and can be replaced once the real API stabilises.
 *
 * The series label is derived entirely from the per-domain ChartConfig
 * (e.g. Aqueduct might use epoch+rcp+gcm, IRIS cyclones might use epoch+ssp+gcm).
 */
const buildScenarioLabel = (record: PixelRecord, config: ChartConfig): string => {
  const parts = config.seriesFields
    .map((field) => getFieldValue(record, field))
    .filter((x): x is string => Boolean(x));

  if (parts.length > 0) {
    return parts.join(' – ');
  }

  // Last resort: domain name so that Vega still has a series identifier
  return record.layer.domain;
};

const toReturnPeriodRows = (records: PixelRecord[], config: ChartConfig): ReturnPeriodRow[] =>
  records
    .map<ReturnPeriodRow | null>((r) => {
      const { hazard, rp, rcp, epoch, gcm, ssp } = r.layer.keys;

      // Skip null values entirely (no data_type field in new API)
      if (r.value == null) {
        return null;
      }

      const numericValue = r.value as number;

      return {
        rp: Number(rp),
        value: numericValue,
        rcp,
        epoch,
        gcm,
        ssp,
        scenario: buildScenarioLabel(r, config),
        domain: r.layer.domain,
        hazard,
      };
    })
    .filter((row): row is ReturnPeriodRow => row !== null);

// RAG (Red-Amber-Green) indicator component
export type RagStatus = 'red' | 'amber' | 'green';

interface RagIndicatorProps {
  status: RagStatus;
}

const RagIndicator: FC<RagIndicatorProps> = ({ status }) => {
  const colorMap = {
    red: '#d32f2f',
    amber: '#ed6c02',
    green: '#2e7d32',
  };

  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: colorMap[status],
        border: '1px solid rgba(0, 0, 0, 0.1)',
        flexShrink: 0,
      }}
      title={`Risk status: ${status}`}
    />
  );
};

interface RagStatusDisplayProps {
  status: RagStatus;
}

export const RagStatusDisplay: FC<RagStatusDisplayProps> = ({ status }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <RagIndicator status={status} />
      <Typography variant="body2" color="text.secondary">
        Risk assessment: {status}
      </Typography>
    </Box>
  );
};

// Chart configs — these are global constants to avoid linter dependency warnings
const aqueductRiverConfig: ChartConfig = {
  id: 'river-aqueduct',
  title: 'River flooding – Aqueduct',
  xLabel: 'return period (years)',
  yLabel: 'value',
  // Aqueduct river flooding: scenario = epoch + rcp + gcm, colour by rcp
  seriesFields: ['epoch', 'rcp', 'gcm'],
  colorField: 'rcp',
};

const jrcFloodConfig: ChartConfig = {
  id: 'river-jrc',
  title: 'River flooding – JRC',
  xLabel: 'return period (years)',
  yLabel: 'value',
  // JRC flood only has rp in the mock data, so just plot a single line
  seriesFields: [],
};

const aqueductCoastalConfig: ChartConfig = {
  id: 'coastal-aqueduct',
  title: 'Coastal flooding – Aqueduct',
  xLabel: 'return period (years)',
  yLabel: 'value',
  // Coastal flooding: scenario = epoch + rcp, colour by rcp
  seriesFields: ['epoch', 'rcp'],
  colorField: 'rcp',
};

const irisCycloneConfig: ChartConfig = {
  id: 'cyclone-iris',
  title: 'Tropical cyclones – IRIS',
  xLabel: 'return period (years)',
  yLabel: 'value',
  // IRIS cyclones: scenario = epoch + ssp, colour by ssp
  seriesFields: ['epoch', 'ssp'],
  colorField: 'ssp',
};

const stormCycloneConfig: ChartConfig = {
  id: 'cyclone-storm',
  title: 'Tropical cyclones – STORM',
  xLabel: 'return period (years)',
  yLabel: 'value',
  // STORM cyclones: scenario = epoch + rcp + gcm, colour by rcp
  seriesFields: ['epoch', 'rcp', 'gcm'],
  colorField: 'rcp',
};

// Hazard-specific components

interface HazardComponentProps {
  records: PixelRecord[];
}

// Thresholds for different hazard types
// Flood height above which damages are substantial (in meters) - used for river and coastal flooding
const FLOOD_HEIGHT_THRESHOLD = 4; // TODO: Make this configurable or derive from domain knowledge

// Threshold for cyclone intensity above which damages are substantial - used for tropical cyclones
const CYCLONE_INTENSITY_THRESHOLD = 50; // TODO: Make this configurable or derive from domain knowledge

// Thresholds for extreme heat probability (0-1 range)
// Red threshold: probability above which risk is high
const EXTREME_HEAT_RED_THRESHOLD = 0.5; // 50% probability
// Amber threshold: probability above which risk is moderate
const EXTREME_HEAT_AMBER_THRESHOLD = 0.3; // 30% probability

// Helper function to calculate RAG status based on return period data
// Uses maximum values (worst case) for RP 10 and RP 100 against a threshold
const calculateRagStatusFromReturnPeriods = (
  data: ReturnPeriodRow[],
  threshold: number,
): RagStatus => {
  // Group by return period and take maximum value (worst case scenario)
  const groupedByRp = _.groupBy(data, (d) => d.rp);

  // Get maximum value for RP 10 (1 in 10 years)
  const rp10Data = groupedByRp[10] || [];
  const maxRp10 = rp10Data.length > 0 ? Math.max(...rp10Data.map((d) => d.value)) : 0;

  // Get maximum value for RP 100 (1 in 100 years)
  const rp100Data = groupedByRp[100] || [];
  const maxRp100 = rp100Data.length > 0 ? Math.max(...rp100Data.map((d) => d.value)) : 0;

  // Apply threshold logic
  if (maxRp10 > threshold) {
    return 'red';
  } else if (maxRp100 > threshold) {
    return 'amber';
  } else {
    return 'green';
  }
};

const RiverFloodingAqueduct: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () =>
      toReturnPeriodRows(
        records.filter((r) => r.layer.domain === 'aqueduct' && r.layer.keys.hazard === 'fluvial'),
        aqueductRiverConfig,
      ),
    [records],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <ReturnPeriodChart config={aqueductRiverConfig} data={data} />
    </Stack>
  );
};

const RiverFloodingJrc: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () =>
      toReturnPeriodRows(
        records.filter((r) => r.layer.domain === 'jrc_flood'),
        jrcFloodConfig,
      ),
    [records],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <ReturnPeriodChart config={jrcFloodConfig} data={data} />
    </Stack>
  );
};

const CoastalFlooding: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () =>
      toReturnPeriodRows(
        records.filter((r) => r.layer.domain === 'aqueduct' && r.layer.keys.hazard === 'coastal'),
        aqueductCoastalConfig,
      ),
    [records],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <ReturnPeriodChart config={aqueductCoastalConfig} data={data} />
    </Stack>
  );
};

const TropicalCyclonesIris: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () =>
      toReturnPeriodRows(
        records.filter((r) => r.layer.domain === 'cyclone_iris'),
        irisCycloneConfig,
      ),
    [records],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, CYCLONE_INTENSITY_THRESHOLD),
    [data],
  );

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <ReturnPeriodChart config={irisCycloneConfig} data={data} />
    </Stack>
  );
};

const TropicalCyclonesStorm: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () =>
      toReturnPeriodRows(
        records.filter((r) => r.layer.domain === 'cyclone_storm'),
        stormCycloneConfig,
      ),
    [records],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, CYCLONE_INTENSITY_THRESHOLD),
    [data],
  );

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <ReturnPeriodChart config={stormCycloneConfig} data={data} />
    </Stack>
  );
};

// Map numeric susceptibility values to categories
// Based on typical landslide susceptibility classifications
const SUSCEPTIBILITY_CATEGORIES: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
};

const ExtremeHeat: FC<HazardComponentProps> = ({ records }) => {
  // Filter for extreme heat records (probability values)
  const extremeHeatRecords = useMemo(
    () =>
      records.filter(
        (r) =>
          r.layer.domain === 'isimip' &&
          r.layer.keys.hazard === 'extreme_heat' &&
          r.layer.keys.metric === 'occurrence',
      ),
    [records],
  );

  // Aggregate all values using maximum (worst case scenario across all epochs/rcp/gcm combinations)
  const aggregatedProbability = useMemo(() => {
    const values = extremeHeatRecords.map((r) => r.value).filter((v): v is number => v != null);
    if (values.length === 0) return 0;
    return Math.max(...values);
  }, [extremeHeatRecords]);

  // Calculate RAG status based on two thresholds
  const ragStatus = useMemo((): RagStatus => {
    if (aggregatedProbability >= EXTREME_HEAT_RED_THRESHOLD) {
      return 'red';
    } else if (aggregatedProbability >= EXTREME_HEAT_AMBER_THRESHOLD) {
      return 'amber';
    } else {
      return 'green';
    }
  }, [aggregatedProbability]);

  const formatProbability = (value: number): string => {
    // Convert to percentage and format with at most one decimal place, removing trailing zeros
    const percentage = value * 100;
    return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`;
  };

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Maximum probability of extreme heat event (worst case across all scenarios)
        </Typography>
        <Typography variant="body1">{formatProbability(aggregatedProbability)}</Typography>
      </Box>
    </Stack>
  );
};

const Landslides: FC<HazardComponentProps> = ({ records }) => {
  const landslideRecords = useMemo(
    () => records.filter((r) => r.layer.domain === 'landslide'),
    [records],
  );

  // Extract values for each subtype (treat null as zero for numeric values)
  const earthquakeProb = useMemo(() => {
    const record = landslideRecords.find((r) => r.layer.keys.subtype === 'earthquake');
    return record?.value == null ? 0 : (record.value as number);
  }, [landslideRecords]);

  const rainfallMeanProb = useMemo(() => {
    const record = landslideRecords.find((r) => r.layer.keys.subtype === 'rainfall_mean');
    return record?.value == null ? 0 : (record.value as number);
  }, [landslideRecords]);

  const rainfallMedianProb = useMemo(() => {
    const record = landslideRecords.find((r) => r.layer.keys.subtype === 'rainfall_median');
    return record?.value == null ? 0 : (record.value as number);
  }, [landslideRecords]);

  const susceptibilityValue = useMemo(() => {
    const record = landslideRecords.find((r) => r.layer.keys.subtype === 'susceptibility');
    return record?.value ?? null;
  }, [landslideRecords]);

  const susceptibilityCategory = useMemo(() => {
    if (susceptibilityValue == null) return null;
    const numValue =
      typeof susceptibilityValue === 'number' ? susceptibilityValue : Number(susceptibilityValue);
    return SUSCEPTIBILITY_CATEGORIES[numValue] ?? `Unknown (${susceptibilityValue})`;
  }, [susceptibilityValue]);

  // Calculate RAG status from susceptibility
  const ragStatus = useMemo((): RagStatus => {
    if (susceptibilityValue == null) return 'amber';
    const numValue =
      typeof susceptibilityValue === 'number' ? susceptibilityValue : Number(susceptibilityValue);
    const category = SUSCEPTIBILITY_CATEGORIES[numValue];

    if (category === 'Very Low') {
      return 'green';
    } else if (category === 'Low') {
      return 'amber';
    } else if (category === 'Medium' || category === 'High') {
      return 'red';
    }
    return 'amber'; // Default fallback
  }, [susceptibilityValue]);

  const formatProbability = (value: number): string => {
    // Convert to percentage and format with at most one decimal place, removing trailing zeros
    const percentage = value * 100;
    return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`;
  };

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Annual probability (earthquake trigger)
          </Typography>
          <Typography variant="body1">{formatProbability(earthquakeProb)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Annual probability (rainfall - mean)
          </Typography>
          <Typography variant="body1">{formatProbability(rainfallMeanProb)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Annual probability (rainfall - median)
          </Typography>
          <Typography variant="body1">{formatProbability(rainfallMedianProb)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Susceptibility
          </Typography>
          <Typography variant="body1">{susceptibilityCategory ?? 'N/A'}</Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

interface PrototypeChartsProps {
  lng: number;
  lat: number;
}

export const PrototypeCharts: FC<PrototypeChartsProps> = ({ lng, lat }) => {
  const [pixelData, setPixelData] = useState<PixelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPixelData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from API endpoint
        const response = await fetch(`/api/pixel-driller/point/${lng}/${lat}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPixelData(asPixelResponse(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pixel data');
        console.error('Error fetching pixel data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPixelData();
  }, [lng, lat]);

  if (loading) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          Loading pixel data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="body2" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!pixelData) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  const { results } = pixelData;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Prototype hazard charts
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">River flooding (Aqueduct)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RiverFloodingAqueduct records={results} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">River flooding (JRC)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RiverFloodingJrc records={results} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Coastal flooding</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CoastalFlooding records={results} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Tropical cyclones (IRIS)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TropicalCyclonesIris records={results} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Tropical cyclones (STORM)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TropicalCyclonesStorm records={results} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Landslides</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Landslides records={results} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Extreme heat</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ExtremeHeat records={results} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
