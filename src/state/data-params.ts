import isDeepEqual from 'fast-deep-equal';
import type { Atom } from 'jotai';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { useAtomCallback } from 'jotai/utils';
import _ from 'lodash';
import { useCallback, useEffect } from 'react';

import {
  DataParamGroupConfig,
  ParamDomain,
  ParamValue,
  resolveParamDependencies,
} from '@/lib/controls/data-params';
import { loadable } from '@/lib/jotai/loadable';

/**
 * Data params config state (domains, defaults, dependencies) per group.
 *
 * The default is a never-resolving promise so first reads Suspend until
 * `useLoadParamsConfig` writes the loaded config.
 *
 * NOTE: the initial value is bound to a typed local before being passed to `atom(...)` —
 * passing `new Promise(() => {})` inline can resolve to the read-only `atom(read)`
 * overload, which then breaks `useSetAtom` callers downstream.
 */
export const paramsConfigAtomFamily = atomFamily((_group: string) => {
  const initial: DataParamGroupConfig | Promise<DataParamGroupConfig> = new Promise(() => {});
  return atom<DataParamGroupConfig | Promise<DataParamGroupConfig>>(initial);
});

/**
 * `loadable`-wrapped view of {@link paramsConfigAtomFamily} per group.
 */
export const paramsConfigLoadableAtomFamily = atomFamily((group: string) =>
  loadable(paramsConfigAtomFamily(group)),
);

interface ValueAndOptions<T = any> {
  value: T;
  options: T[];
}

/**
 * Data params state (current value + available options) per group.
 *
 * Default is a never-resolving promise until `useLoadParamsConfig` initializes the group.
 */
export const paramsAtomFamily = atomFamily((_group: string) => {
  const initial: Record<string, ValueAndOptions> | Promise<Record<string, ValueAndOptions>> =
    new Promise(() => {});
  return atom<Record<string, ValueAndOptions> | Promise<Record<string, ValueAndOptions>>>(initial);
});

/**
 * Initialize data params state (value/options) and config for a group, based on an external config atom.
 *
 * @param configAtom atom (sync or async) producing the loaded configuration
 * @param targetGroup string representing the target data params group
 */
export function useLoadParamsConfig(
  configAtom: Atom<DataParamGroupConfig | Promise<DataParamGroupConfig>>,
  targetGroup: string,
) {
  const config = useAtomValue(configAtom);
  const setTargetConfig = useSetAtom(paramsConfigAtomFamily(targetGroup));
  const setTargetState = useSetAtom(paramsAtomFamily(targetGroup));
  const targetConfigLoadable = useAtomValue(paramsConfigLoadableAtomFamily(targetGroup));

  useEffect(() => {
    if (targetConfigLoadable.state !== 'hasData') {
      const [values, options] = resolveParamDependencies(config.paramDefaults, config);
      const initialState = _.mapValues(values, (value, key) => ({ value, options: options[key] }));
      setTargetState(initialState);
      setTargetConfig(config);
    }
  }, [config, setTargetConfig, setTargetState, targetConfigLoadable.state]);
}

/**
 * Returns a callback for updating a data param with a new value, resolving dependent options.
 */
export function useUpdateDataParam(group: string, paramId: string) {
  const config = useAtomValue(paramsConfigAtomFamily(group));

  return useAtomCallback(
    useCallback(
      (get, set, newValue: ParamValue) => {
        const state = get(paramsAtomFamily(group)) as Record<string, ValueAndOptions>;

        const oldValues = _.mapValues(state, (x) => x.value);
        const newValues = { ...oldValues, [paramId]: newValue };

        const [resolvedValues, resolvedOptions] = resolveParamDependencies<Record<string, any>>(
          newValues,
          config,
        );

        const resolvedState = _.mapValues(state, (x, key) => ({
          value: resolvedValues[key],
          options: resolvedOptions[key],
        }));

        set(paramsAtomFamily(group), resolvedState);
      },
      [group, paramId, config],
    ),
  );
}

/** Object param for atomFamily lookups: `{ group, param }`. */
export type DataParamParam = Readonly<{
  group: string;
  param: string;
}>;

/** Data param current value per group+param */
export const paramValueAtomFamily = atomFamily(
  ({ group, param }: DataParamParam) =>
    atom((get) => get(paramsAtomFamily(group))?.[param]?.value as ParamValue),
  isDeepEqual,
);

/** Data param available options per group+param */
export const paramOptionsAtomFamily = atomFamily(
  ({ group, param }: DataParamParam) =>
    atom((get) => (get(paramsAtomFamily(group))?.[param]?.options ?? []) as ParamDomain),
  isDeepEqual,
);

/** Dictionary of all param current values, per group */
export const dataParamsByGroupAtomFamily = atomFamily((group: string) =>
  atom((get) => {
    const state = get(paramsAtomFamily(group)) as Record<string, ValueAndOptions>;
    return _.mapValues(state, (x) => x.value);
  }),
);
