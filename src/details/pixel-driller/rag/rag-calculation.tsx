import _ from 'lodash';

import { ReturnPeriodRow } from '../types';
import { RagStatus } from './rag-types';

/**
 * Calculate the RAG status based on the return period values and a threshold.
 * Uses the maximum value for the more frequent and less frequent return periods.
 * If the value for the more frequent return period is above the threshold, the RAG status is red.
 * If the value for the less frequent return period is above the threshold, the RAG status is amber.
 * Otherwise, the RAG status is green.
 */
export function calculateRagFromReturnPeriodValuesOneThreshold(
  data: ReturnPeriodRow[],
  threshold: number,
  /**
   * The more frequent return period.
   * If the value for this return period is above the threshold, the RAG status is red.
   * Default is 10 years.
   */
  rpMoreFrequent: number = 10,
  /**
   * The less frequent return period.
   * If the value for this return period is above the threshold, the RAG status is amber.
   * Default is 100 years.
   */
  rpLessFrequent: number = 100,
): RagStatus {
  if (data.length === 0) {
    return 'no-data';
  }

  // Group by return period and take maximum value (worst case scenario)
  const groupedByRp = _.groupBy(data, (d) => d.rp);

  // Get maximum value for RP 10 (1 in 10 years)
  const rp10Data = groupedByRp[rpMoreFrequent] || [];
  const maxRp10 = rp10Data.length > 0 ? Math.max(...rp10Data.map((d) => d.value)) : 0;

  // Get maximum value for RP 100 (1 in 100 years)
  const rp100Data = groupedByRp[rpLessFrequent] || [];
  const maxRp100 = rp100Data.length > 0 ? Math.max(...rp100Data.map((d) => d.value)) : 0;

  // Apply threshold logic
  if (maxRp10 >= threshold) {
    return 'red';
  } else if (maxRp100 >= threshold) {
    return 'amber';
  } else {
    return 'green';
  }
}

/**
 * Calculate the RAG status based on a single value and two thresholds.
 * If the value is above the red threshold, the RAG status is red.
 * If the value is above the amber threshold, the RAG status is amber.
 * If the value is null, the status is no-data.
 * Otherwise, the RAG status is green.
 */
export function calculateRagFromSingleValueTwoThresholds(
  value: number | null,
  redThreshold: number,
  amberThreshold: number,
): RagStatus {
  if (value == null) {
    return 'no-data';
  }

  if (value >= redThreshold) {
    return 'red';
  } else if (value >= amberThreshold) {
    return 'amber';
  } else {
    return 'green';
  }
}

/**
 * Combine multiple RAG statuses, returning the "worst" (most severe) one.
 * - If all statuses are no-data / not-implemented, returns no-data.
 * - Otherwise, ignores no-data / not-implemented and returns the highest of green < amber < red.
 */
export function combineRagStatusesMax(...statuses: RagStatus[]): RagStatus {
  const meaningful = statuses.filter(
    (status) => status !== 'no-data' && status !== 'not-implemented',
  );

  if (meaningful.length === 0) {
    return 'no-data';
  }

  const order: RagStatus[] = ['green', 'amber', 'red'];

  return meaningful.reduce((current, next) => {
    return order.indexOf(next) > order.indexOf(current) ? next : current;
  }, meaningful[0]);
}
