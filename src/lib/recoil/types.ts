import { ReadOnlySelectorOptions, RecoilState, RecoilValueReadOnly } from 'recoil';

/**
 * A readable and writable recoil state family
 */
export type RecoilStateFamily<DataType, ParamType> = (param: ParamType) => RecoilState<DataType>;

/**
 * A recoil state family for which only read operation is required
 */
export type RecoilReadableStateFamily<DataType, ParamType> = (
  param: ParamType,
) => RecoilState<DataType> | RecoilValueReadOnly<DataType>;

/** The type for the `get` property of Recoil read-only `selector` options */
export type ReadSelectorGetDefinition<T> = ReadOnlySelectorOptions<T>['get'];
