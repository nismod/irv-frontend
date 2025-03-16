import { FetchStatus, QueryStatus } from '@tanstack/react-query';

export enum QueryResultStatus {
  Idle = 'idle',
  Loading = 'loading',
  QueryError = 'queryError',
}

export type QueryStatusResult<ResultT> =
  | {
      status: QueryResultStatus.Loading | QueryResultStatus.Idle | QueryResultStatus.QueryError;
      data: null;
    }
  | ResultT;

export interface IUseQueryResult<DataT, ErrorT = any> {
  status: QueryStatus;
  fetchStatus: FetchStatus;
  error?: ErrorT;
  data?: DataT;
}

export function computeQueryStatus<DataT, ResultT>(
  { status, fetchStatus, data, error }: IUseQueryResult<DataT>,
  pvFullName: string,
  dataStatusFn: (data: DataT, pvName: string) => ResultT,
  queryErrorFn?: (error) => QueryStatusResult<ResultT>,
): QueryStatusResult<ResultT> {
  if (status === 'pending') {
    // The query is actively loading (initial load)
    if (fetchStatus === 'fetching') {
      return {
        status: QueryResultStatus.Loading,
        data: null,
      };
    } else {
      // The query is completely idle (has not started, no data)
      return {
        status: QueryResultStatus.Idle,
        data: null,
      };
    }
  }

  // The query failed
  if (status === 'error') {
    if (queryErrorFn != null) {
      const errResult = queryErrorFn(error);

      if (errResult != null) {
        return errResult;
      }
    }

    return {
      status: QueryResultStatus.QueryError,
      data: null,
    };
  }

  // If the query is successful, use the data status function
  return dataStatusFn(data!, pvFullName);
}
