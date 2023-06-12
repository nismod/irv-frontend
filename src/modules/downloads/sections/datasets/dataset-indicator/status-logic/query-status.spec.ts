import { describe, expect, it, vi } from 'vitest';

import { QueryResultStatus, computeQueryStatus } from './query-status';

describe('Compute state of API query with specified data status function', () => {
  const PV_NAME = 'processor.version';

  it('returns status:idle and no data for when API query is not started', () => {
    const { status, data } = computeQueryStatus({ status: 'idle', data: null }, PV_NAME, vi.fn());

    expect(status).toBe('idle');
    expect(data).toBe(null);
  });

  it('returns status:loading and no data when API query is loading', () => {
    const { status, data } = computeQueryStatus(
      { status: 'loading', data: null },
      PV_NAME,
      vi.fn(),
    );

    expect(status).toBe(QueryResultStatus.Loading);
    expect(data).toBe(null);
  });

  it('returns status:queryError and no data when API query errored', () => {
    const { status, data } = computeQueryStatus({ status: 'error', data: null }, PV_NAME, vi.fn());

    expect(status).toBe(QueryResultStatus.QueryError);
    expect(data).toBe(null);
  });

  it('uses dataStatusFn if the query status is success', async () => {
    const INPUT = { input: 1 };
    const RESULT = { output: 2 };
    const dataStatusFn = vi.fn((data: typeof INPUT, pvName: string) => ({
      status: 'something' as const,
      data: RESULT,
    }));

    const { status, data } = computeQueryStatus(
      { status: 'success', data: INPUT },
      PV_NAME,
      dataStatusFn,
    );

    expect(dataStatusFn).toHaveBeenCalledWith(INPUT, PV_NAME);
    expect(status).toBe('something');
    expect(data).toBe(RESULT);
  });

  it('uses result of errorFn if available and query errored', () => {
    const ERR_RESULT = { status: 'Some status' as const, data: null };
    const errFn = vi.fn((err) => ERR_RESULT);
    const dataStatusFn = vi.fn();

    const ERROR = { status: 404 };

    const result = computeQueryStatus(
      { status: 'error', data: null, error: ERROR },
      PV_NAME,
      dataStatusFn,
      errFn,
    );

    expect(errFn).toHaveBeenCalledWith(ERROR);
    expect(dataStatusFn).toHaveBeenCalledTimes(0);

    expect(result).toBe(ERR_RESULT);
  });

  it.each([null, undefined])('returns status:queryError if errorFn returns nullish', (nullish) => {
    const errFn = vi.fn((err) => nullish);
    const dataStatusFn = vi.fn();

    const ERROR = { status: 404 };

    const { status, data } = computeQueryStatus(
      { status: 'error', data: null, error: ERROR },
      PV_NAME,
      dataStatusFn,
      errFn,
    );

    expect(errFn).toHaveBeenCalledWith(ERROR);

    expect(status).toBe(QueryResultStatus.QueryError);
    expect(data).toBe(null);
  });
});
