import { useAtomValue } from 'jotai';

import {
  paramOptionsAtomFamily,
  paramsAtomFamily,
  paramValueAtomFamily,
  useUpdateDataParam,
} from '@/state/data-params';

export const DataParam = ({ group, id, children }) => {
  const config = useAtomValue(paramsAtomFamily(group));

  const value = useAtomValue(paramValueAtomFamily({ group, param: id }));
  const updateValue = useUpdateDataParam(group, id);
  const options = useAtomValue(paramOptionsAtomFamily({ group, param: id }));

  if (config == null) return null;

  return typeof children === 'function'
    ? children({ value: value, onChange: updateValue, options })
    : children;
};
