import _ from 'lodash';
import { FC, useMemo } from 'react';
import { VegaEmbed } from 'react-vega';

import { unique } from '@/lib/helpers';

import { ExpectedDamageCell } from './ExpectedDamagesSection';

const makeSpec = (
  yearValues: string[],
  field_min: string,
  field: string,
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
        y2: { field: field_max },
        x: {
          field: 'epoch',
          type: 'ordinal',
        },
        color: {
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
          field: 'epoch',
          type: 'ordinal',
          title: 'Year',
          axis: {
            gridDash: [2, 2],
            domainColor: '#ccc',
            tickColor: '#ccc',
            values: yearValues,
          },
        },
        y: {
          field: field,
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
          { field: field, type: 'quantitative', format: ',.3r', title: field_title },
          { field: 'rcp', title: 'RCP' },
          { field: 'epoch', type: 'ordinal', title: 'Year' },
          { field: field_min, type: 'ordinal', format: ',.3r', title: 'EAD (USD, min)' },
          { field: field_max, type: 'ordinal', format: ',.3r', title: 'EAD (USD, max)' },
        ],
      },
    },
  ],
  config: {
    view: {
      step: 85,
    },
  },
  height: 100,
});

// need to map special value to year to maintain chronological ordering on the X axis
function prepareEpoch(epoch: string) {
  return epoch === 'present' || epoch === 'baseline' ? '2020' : epoch;
}

interface ExpectedDamageChartProps {
  data: {
    table: ExpectedDamageCell[];
  };
  field: keyof ExpectedDamageCell;
  field_min: keyof ExpectedDamageCell;
  field_max: keyof ExpectedDamageCell;
  field_title: string;
}

export const ExpectedDamageChart: FC<ExpectedDamageChartProps> = ({
  data,
  field,
  field_min,
  field_max,
  field_title,
}) => {
  // For some reason, Vega was complaining about not being able to extend objects, hence the cloning here.
  // Perhaps it's to do with Recoil freezing state objects
  const clonedData = useMemo(
    () => ({
      table: _.cloneDeep(data.table).map((d) => ({ ...d, epoch: prepareEpoch(d.epoch) })),
    }),
    [data],
  );

  const spec = useMemo(
    () =>
      makeSpec(
        unique(clonedData.table.map((d) => d.epoch)).sort(),
        field_min,
        field,
        field_max,
        field_title,
        clonedData.table,
      ),
    [clonedData, field_min, field, field_max, field_title],
  );

  return (
    <VegaEmbed
      spec={spec}
      options={{
        actions: false,
        padding: 0,
        renderer: 'svg',
      }}
    />
  );
};
