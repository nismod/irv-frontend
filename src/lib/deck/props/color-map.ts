import { css2rgba$M } from '@/lib/colors';

import { AccessorFunction, mergeTriggers, withTriggers } from './getters';

export function dataColorMap<T>(
  dataSource: AccessorFunction<T>,
  colorSource: AccessorFunction<string, T>,
) {
  return withTriggers(
    (x) => css2rgba$M(colorSource(dataSource(x))),
    mergeTriggers(dataSource, colorSource),
  );
}
