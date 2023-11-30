import { css2rgba$M } from '@/lib/colors';

import { AccessorFunction, mergeTriggers, withTriggers } from './getters';
import { GetColor } from './style';

/**
 *  Factory function to create a deck.gl-compatible accessor function that returns a color based on the data.
 *
 */
export function makeDataColorAccessor<T>(
  /** Data accessor which returns a data value for each feature */
  dataSource: AccessorFunction<T>,
  /** Color accessor which returns a CSS string color based on the feature data value */
  colorSource: AccessorFunction<string, T>,
): GetColor {
  return withTriggers(
    (x) => css2rgba$M(colorSource(dataSource(x))),
    mergeTriggers(dataSource, colorSource),
  );
}
