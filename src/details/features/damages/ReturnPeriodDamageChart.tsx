import _ from 'lodash';
import { useMemo } from 'react';
import { VegaLite } from 'react-vega';

import { unique } from '@/lib/helpers';

const makeSpec = (rpValues: number[], field_key: string, field_title: string) => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
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
        // Could do custom colours
        // range: ["#e7ba52", "#c7c7c7", "#aec7e8", "#1f77b4"]
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
    ],
  },
});

export const ReturnPeriodDamageChart = ({ data, field_key, field_title, ...props }) => {
  // For some reason, Vega was complaining about not being able to extend objects, hence the cloning here.
  // Perhaps it's to do with Recoil freezing state objects
  const clonedData = useMemo(() => _.cloneDeep(data), [data]);

  const spec = useMemo(
    () =>
      makeSpec(
        unique<number>(clonedData.table.map((d) => d.rp))
          .sort()
          .reverse(),
        field_key,
        field_title,
      ),
    [clonedData.table, field_key, field_title],
  );

  return <VegaLite data={clonedData} spec={spec as any} {...props} />;
};
