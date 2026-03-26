import Box from '@mui/material/Box';
import { useEffect, useRef } from 'react';
import { useVegaEmbed } from 'react-vega';

import { Callout } from '@/pages/articles/components/Callout';

import data from './data.json';

const SPEC = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  data: { values: data },
  mark: 'bar',
  encoding: {
    x: { field: 'category', type: 'ordinal', axis: { title: 'Category' } },
    y: { field: 'value', type: 'quantitative', axis: { title: 'Value' } },
  },
} as const;

export const VegaBarChart = () => {
  const vegaRef = useRef<HTMLDivElement>(null);
  const embed = useVegaEmbed({
    spec: SPEC as any,
    options: {
      mode: 'vega-lite',
      actions: false,
      renderer: 'svg',
    },
    ref: vegaRef,
  });

  return (
    <Callout title="Example bar chart">
      <Box>
        <div ref={vegaRef} />
      </Box>
    </Callout>
  );
};
