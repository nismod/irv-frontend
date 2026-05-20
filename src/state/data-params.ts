import type { Atom } from 'jotai';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai-family';
import _ from 'lodash';
import { useEffect } from 'react';
import {
  atomFamily as recoilAtomFamily,
  selectorFamily,
  useRecoilTransaction_UNSTABLE,
  useSetRecoilState,
} from 'recoil';

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
 * Recoil↔Jotai migration: config half of the data-params hub (Jotai). Param values
 * remain in Recoil `paramsState` until Slice 14.
 *
 * The default is a never-resolving promise so first reads Suspend until
 * `useLoadParamsConfig` writes the loaded config (same pattern as the previous Recoil
 * `atomFamily`).
 *
 * NOTE: the initial value is bound to a typed local before being passed to `atom(...)` —
 * passing `new Promise(() => {})` inline can resolve to the read-only `atom(read)`
 * overload, which then breaks `useSetAtom` callers downstream (same Jotai pitfall as
 * the `T | null` case in `makeSelectAtom`).
 */
export const paramsConfigAtomFamily = atomFamily((_group: string) => {
  // Union with the sync type so `useSetAtom` accepts a plain `DataParamGroupConfig` —
  // Jotai resolves `useAtomValue` via `Awaited<Value>`, so consumers still observe
  // the unwrapped config. The explicit generic on `atom<...>(...)` is required: without
  // it, `atomFamily`'s return-type inference narrows to `Promise<DataParamGroupConfig>`
  // and breaks `useSetAtom(...)` with a sync value.
  const initial: DataParamGroupConfig | Promise<DataParamGroupConfig> = new Promise(() => {});
  return atom<DataParamGroupConfig | Promise<DataParamGroupConfig>>(initial);
});

/**
 * `loadable`-wrapped view of {@link paramsConfigAtomFamily} per group.
 *
 * Memoised as its own family so that consumers reading from a Jotai `get(...)` (e.g.
 * `hazardDataParamsAtom` in the damages slice) do not create a fresh derived atom on
 * every read. Returns Jotai's `{ state: 'loading' | 'hasData' | 'hasError', ... }`
 * shape rather than suspending.
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
 * Still on Recoil for now — migrating this requires coordinating with the layer
 * selectors that read `dataParamsByGroupState` (hazards, population exposure,
 * damages styling). The corresponding Jotai migration is scheduled with the rest of
 * Slice 14.
 */
export const paramsState = recoilAtomFamily<Record<string, ValueAndOptions>, string>({
  key: 'paramsState',
  default: () => new Promise(() => {}),
});

/**
 * Initialize data params state (value/options) and config for a group, based on an external config atom.
 *
 * Splits the writes across stores during the in-progress Recoil → Jotai migration:
 * the **config** half lives in {@link paramsConfigAtomFamily} (Jotai); the **state**
 * half (current values + resolved options) is still written to the Recoil
 * `paramsState` family. `useLoadParamsConfig` only runs once per group — once the
 * Jotai config atom has data, the effect is a no-op.
 *
 * @param configAtom a Jotai atom (sync or async) producing the loaded configuration
 * @param targetGroup string representing the target data params group
 */
export function useLoadParamsConfig(
  configAtom: Atom<DataParamGroupConfig | Promise<DataParamGroupConfig>>,
  targetGroup: string,
) {
  const config = useAtomValue(configAtom);
  const setTargetConfig = useSetAtom(paramsConfigAtomFamily(targetGroup));
  const setTargetState = useSetRecoilState(paramsState(targetGroup));
  const targetConfigLoadable = useAtomValue(paramsConfigLoadableAtomFamily(targetGroup));

  useEffect(() => {
    if (targetConfigLoadable.state !== 'hasData') {
      const [values, options] = resolveParamDependencies(config.paramDefaults, config);
      const initialState = _.mapValues(values, (value, key) => ({ value, options: options[key] }));
      setTargetState(initialState); // Recoil (param values)
      setTargetConfig(config); // Jotai (param config)
    }
  }, [config, setTargetConfig, setTargetState, targetConfigLoadable.state]);
}

/**
 * Returns a recoil transaction callback for updating a data param with a new value.
 *
 * Resolves dependencies between individual parameters, to update the available options for each param.
 *
 * During the migration: the per-group config is read from the Jotai
 * {@link paramsConfigAtomFamily} at hook scope and captured by closure, sidestepping
 * the Recoil transaction limitation that `get` may not read selectors. The transaction
 * body itself only reads and writes the Recoil `paramsState` family. This is what
 * lets `paramsConfigState` migrate to Jotai independently of the rest of the spine.
 *
 * @param group data param group name
 * @param paramId data param name
 * @returns the value update callback
 */
export function useUpdateDataParam(group: string, paramId: string) {
  const config = useAtomValue(paramsConfigAtomFamily(group)); // Jotai

  return useRecoilTransaction_UNSTABLE(
    // Recoil
    ({ get, set }) =>
      (newValue) => {
        const state = get(paramsState(group));

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

        set(paramsState(group), resolvedState);
      },
    [group, paramId, config],
  );
}

/**
 * Recoil atom/selector family param describing a data parameter (data group + data param name)
 */
export type DataParamParam = Readonly<{
  group: string;
  param: string;
}>;

/**
 * Data param current value per group+param
 */
export const paramValueState = selectorFamily<ParamValue, DataParamParam>({
  key: 'paramValueState',
  get:
    ({ group, param }) =>
    ({ get }) =>
      get(paramsState(group))?.[param]?.value,
});

/**
 * Data param available options per group+param
 */
export const paramOptionsState = selectorFamily<ParamDomain, DataParamParam>({
  key: 'paramOptionsState',
  get:
    ({ group, param }) =>
    ({ get }) =>
      get(paramsState(group))?.[param]?.options ?? [],
});

/**
 * Dictionary of all param current values, per group
 */
export const dataParamsByGroupState = selectorFamily({
  key: 'dataParamsByGroupState',
  get:
    (group: string) =>
    ({ get }) =>
      _.mapValues(get(paramsState(group)), (x) => x.value),
});
