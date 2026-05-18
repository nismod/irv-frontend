import type { Atom, Getter, WritableAtom } from 'jotai';
import type { AtomFamily } from 'jotai-family';

/**
 * A readable and writable jotai atom family.
 *
 * This is the Jotai equivalent of the previous `RecoilStateFamily<Data, Param>` type
 * (from `src/lib/recoil/types.ts`) and is used as the parameter type for helpers like
 * `useSetAtomFamily`.
 *
 * The family produces a primitive (or otherwise writable) atom for a given parameter.
 */
export type JotaiStateFamily<DataType, ParamType> = AtomFamily<
  ParamType,
  WritableAtom<DataType, [DataType], void>
>;

/**
 * A jotai atom family that only needs to be read.
 *
 * Use this in helper signatures that accept any family — writable or read-only —
 * because every writable atom is also a readable atom.
 */
export type JotaiReadableStateFamily<DataType, ParamType> = AtomFamily<ParamType, Atom<DataType>>;

/**
 * Type for the `read` function of a jotai derived/read-only atom (the function passed
 * as the first argument to `atom()`).
 *
 * This mirrors the previous `ReadSelectorGetDefinition<T>` Recoil helper type.
 */
export type ReadAtomGetter<T> = (get: Getter) => T;
