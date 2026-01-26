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
