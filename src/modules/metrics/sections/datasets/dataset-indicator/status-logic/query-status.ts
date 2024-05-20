import { QueryStatus } from 'react-query';

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
  error?: ErrorT;
  data?: DataT;
}

export function computeQueryStatus<DataT, ResultT>(
  { status: queryStatus, data, error }: IUseQueryResult<DataT>,
  pvFullName: string,
  dataStatusFn: (data: DataT, pvName: string) => ResultT,
  queryErrorFn?: (error) => QueryStatusResult<ResultT>,
): QueryStatusResult<ResultT> {
  if (queryStatus === 'idle') {
    return {
      status: QueryResultStatus.Idle,
      data: null,
    };
  }
  if (queryStatus === 'loading') {
    return {
      status: QueryResultStatus.Loading,
      data: null,
    };
  }
  if (queryStatus === 'error') {
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

  return dataStatusFn(data, pvFullName);
}
