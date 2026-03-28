import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useRef } from 'react';
import { useVegaEmbed } from 'react-vega';
import { EmbedOptions, VisualizationSpec } from 'vega-embed';

import { Callout } from './Callout';

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

interface ArticleChartProps {
  title?: string;
  description?: string;
  spec: VisualizationSpec;
  options?: EmbedOptions;
  data: any[];
}

/**
 * Generic wrapper for charts embedded in articles.
 * Authors can wrap a chart component with this for consistent styling.
 * The data is passed to the Vega chart under the name 'values'.
 */
export const ArticleChart = ({
  title = 'Chart',
  description,
  spec,
  options,
  data,
}: ArticleChartProps) => {
  const mergedOptions = useMemo(() => mergeEmbedOptions(DEFAULT_OPTIONS, options), [options]);

  return (
    <Callout title={title}>
      <Box>
        <VegaChart spec={spec} options={mergedOptions} data={data} />
      </Box>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {description}
        </Typography>
      )}
    </Callout>
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
