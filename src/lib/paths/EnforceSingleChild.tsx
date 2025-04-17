import { FC, useCallback, useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

import { RecoilStateFamily } from '@/lib/recoil/types';

import { usePath, usePathChildren } from './context';
import { makeChildPath } from './utils';

function StateWatcher({ state, onValue }) {
  const value = useRecoilValue(state);

  useEffect(() => {
    onValue(value);
  }, [onValue, value]);

  return null;
}

export const EnforceSingleChild: FC<{ attributeState: RecoilStateFamily<boolean, string> }> = ({
  attributeState,
}) => {
  const path = usePath();
  const subPaths = usePathChildren(path);

  const enforceLimit = useRecoilCallback(
    ({ set }) =>
      (newShown: string) => {
        for (const sp of subPaths) {
          if (sp !== newShown) {
            set(attributeState(makeChildPath(path, sp)), false);
          }
        }
      },
    [path, subPaths, attributeState],
  );

  const handleChange = useCallback(
    (subPath, attributeValue) => {
      if (attributeValue) {
        enforceLimit(subPath);
      }
    },
    [enforceLimit],
  );

  return (
    <>
      {subPaths.map((sp) => (
        <StateWatcher
          key={sp}
          state={attributeState(makeChildPath(path, sp))}
          onValue={(v) => handleChange(sp, v)}
        />
      ))}
    </>
  );
};
