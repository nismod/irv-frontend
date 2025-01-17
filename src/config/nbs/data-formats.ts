import { FormatConfig } from '@/lib/data-map/view-layers';
import { FormatFunction, nullFormat } from '@/lib/formats';

import { NBS_DATA_VARIABLE_METADATA } from './metadata';

const defaultNumberFormatFn = (x: number) =>
  x?.toLocaleString(undefined, { maximumSignificantDigits: 3 });

export function getNbsDataFormatsConfig(): FormatConfig {
  return {
    getDataLabel: ({ field }) => NBS_DATA_VARIABLE_METADATA[field]?.label,
    getValueFormatted: (value, { field }) => {
      const metadata = NBS_DATA_VARIABLE_METADATA[field];

      let formatFn: FormatFunction<any>;
      if (metadata?.dataType === 'continuous') {
        formatFn = metadata.continuousConfig.numberFormatFn ?? defaultNumberFormatFn;
      } else {
        formatFn = (x: any) => `${x}`;
      }

      formatFn = nullFormat(formatFn);

      return formatFn(value);
    },
  };
}
