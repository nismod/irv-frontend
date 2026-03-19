import Box from '@mui/material/Box';
import { useEffect, useRef } from 'react';
import { useVegaEmbed } from 'react-vega';
import { VisualizationSpec } from 'vega-embed';

import { Callout } from '@/pages/articles/components/article-components';

import data from './data.json';

const SPEC: VisualizationSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  data: { values: data },
  mark: 'bar',
  encoding: {
    x: { field: 'category', type: 'ordinal', axis: { title: 'Category' } },
    y: { field: 'value', type: 'quantitative', axis: { title: 'Value' } },
  },
};

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
