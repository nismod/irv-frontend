import { describe, expect, it } from 'vitest';

import { computeDatasetStatus, DatasetStatus } from './dataset-status';
import { PackageDataStatus } from './package-data';
import { QueryResultStatus } from './query-status';

describe('compute dataset status', () => {
  it('returns loading while the package query is loading', () => {
    expect(computeDatasetStatus(QueryResultStatus.Loading)).toBe(DatasetStatus.Loading);
  });

  it('throws if the package query is idle', () => {
    expect(() => computeDatasetStatus(QueryResultStatus.Idle)).toThrow();
  });

  it('returns unknown when the package query failed', () => {
    expect(computeDatasetStatus(QueryResultStatus.QueryError)).toBe(DatasetStatus.Unknown);
  });

  it('returns ready when the package is available', () => {
    expect(computeDatasetStatus(PackageDataStatus.Available)).toBe(DatasetStatus.Ready);
  });

  it('returns unavailable when the package is not available', () => {
    expect(computeDatasetStatus(PackageDataStatus.Unavailable)).toBe(DatasetStatus.Unavailable);
  });
});
