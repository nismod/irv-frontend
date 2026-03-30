import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import _ from 'lodash';
import { FC, useMemo, useState } from 'react';

import { ChartConfig, ReturnPeriodRow } from '../types';
import { ReturnPeriodDetailedChart } from './return-period-detailed';
import { ReturnPeriodGroupedByPathwayChart } from './return-period-grouped-by-pathway';

export interface ReturnPeriodChartProps {
  config: ChartConfig;
  data: ReturnPeriodRow[];
}

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
            data={filteredData}
            config={config}
            width={400}
            height={chartHeight}
          />
        ) : (
          <ReturnPeriodGroupedByPathwayChart
            data={filteredData}
            config={config}
            width={400}
            height={chartHeight}
          />
        )}
      </Box>
    </Box>
  );
};
