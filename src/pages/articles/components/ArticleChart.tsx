import Box from '@mui/material/Box';
import { useEffect, useMemo, useRef } from 'react';
import { useVegaEmbed } from 'react-vega';
import { EmbedOptions, VisualizationSpec } from 'vega-embed';

import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

const DEFAULT_OPTIONS: EmbedOptions = {
  mode: 'vega-lite',
  actions: {
    export: true,
    source: false,
    compiled: false,
    editor: false,
  },
  renderer: 'svg',
};

function mergeEmbedOptions(base: EmbedOptions, override?: EmbedOptions): EmbedOptions {
  if (!override) return base;

  const merged: EmbedOptions = { ...base, ...override };

  const baseActions = base.actions as any;
  const overrideActions = override.actions as any;
  if (baseActions && typeof baseActions === 'object') {
    merged.actions = { ...baseActions, ...(overrideActions ?? {}) } as any;
  }

  return merged;
}

export interface ArticleChartProps {
  spec: VisualizationSpec;
  options?: EmbedOptions;
  data: any[];
}

/**
 * Vega-Lite chart for articles. Pass data under the name `values`.
 * Wrap with `ArticleFigure` for title and caption.
 */
export const ArticleChart = ({ spec, options, data }: ArticleChartProps) => {
  const mergedOptions = useMemo(() => mergeEmbedOptions(DEFAULT_OPTIONS, options), [options]);

  return (
    <ErrorBoundary message="There was a problem displaying this chart.">
      <Box>
        <VegaChart spec={spec} options={mergedOptions} data={data} />
      </Box>
    </ErrorBoundary>
  );
};

const VegaChart = ({
  spec,
  options,
  data,
}: {
  spec: VisualizationSpec;
  options: EmbedOptions;
  data: any[];
}) => {
  const vegaRef = useRef<HTMLDivElement>(null);
  const embed = useVegaEmbed({
    spec,
    options,
    ref: vegaRef,
  });

  useEffect(() => {
    embed?.view.data('values', data).runAsync();
  }, [embed, data]);

  return <div ref={vegaRef} />;
};
