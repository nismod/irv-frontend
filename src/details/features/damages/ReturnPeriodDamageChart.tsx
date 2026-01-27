import _ from 'lodash';
import { useMemo } from 'react';
import { VegaEmbed } from 'react-vega';

import { unique } from '@/lib/helpers';

const makeSpec = (
  field_key: string,
  field_min: string,
  field_max: string,
  field_title: string,
  data: any[],
) => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  data: {
    values: data,
  },
  layer: [
    {
      mark: 'errorbar',
      encoding: {
        y: {
          field: field_min,
          type: 'quantitative',
          scale: { zero: false },
        },
        y2: { field: field_max, title: 'Range max' },
        x: {
          field: 'rp',
          type: 'quantitative',
        },
        color: {
          title: 'RCP',
          field: 'rcp',
          type: 'ordinal',
          scale: {
            domain: ['baseline', '2.6', '4.5', '8.5'],
            // Drawn from IPCC AR6 colormap https://pyam-iamc.readthedocs.io/en/stable/tutorials/ipcc_colors.html
            range: ['#8b8b8b', '#003466', '#709fcc', '#980002'],
          },
        },
        tooltip: { value: false },
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
          title: 'Return Period (Years)',
          axis: {
            gridDash: [2, 2],
            domainColor: '#ccc',
            tickColor: '#ccc',
          },
        },
        y: {
          field: field_key,
          type: 'quantitative',
          title: field_title,
          axis: {
            gridDash: [2, 2],
            domainColor: '#ccc',
            tickColor: '#ccc',
          },
        },

        color: {
          field: 'rcp',
          type: 'ordinal',
          scale: {
            domain: ['baseline', '2.6', '4.5', '8.5'],
            // Drawn from IPCC AR6 colormap https://pyam-iamc.readthedocs.io/en/stable/tutorials/ipcc_colors.html
            range: ['#8b8b8b', '#003466', '#709fcc', '#980002'],
          },
          title: 'RCP',
          legend: {
            orient: 'bottom',
            direction: 'horizontal',
          },
        },
        // the tooltip encoding needs to replicate the field definitions in order to customise their ordering
        tooltip: [
          { field: field_key, type: 'quantitative', format: ',.3r', title: field_title },
          { field: 'rcp', title: 'RCP' },
          { field: 'rp', title: 'Return Period' },
          { field: field_min, type: 'ordinal', format: ',.3r', title: 'Damage (USD, min)' },
          { field: field_max, type: 'ordinal', format: ',.3r', title: 'Damage (USD, max)' },
        ],
      },
    },
  ],
});

export const ReturnPeriodDamageChart = ({ data, field_key, field_title, field_min, field_max }) => {
  // For some reason, Vega was complaining about not being able to extend objects, hence the cloning here.
  // Perhaps it's to do with Recoil freezing state objects
  const clonedData = useMemo(() => _.cloneDeep(data), [data]);

  const spec = useMemo(
    () => makeSpec(field_key, field_min, field_max, field_title, clonedData.table),
    [clonedData.table, field_key, field_title, field_min, field_max],
  );
  return (
    <VegaEmbed
      spec={spec}
      options={{
        height: 150,
        width: 355,
        actions: false,
        padding: 0,
        renderer: 'svg',
      }}
    />
  );
};
