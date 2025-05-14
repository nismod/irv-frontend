import { FC, useCallback } from 'react';
import { useRecoilCallback } from 'recoil';

import { RecoilStateFamily } from '@/lib/recoil/types';

import { StateWatcher } from '../recoil/StateWatcher';
import { usePath, usePathChildren } from './context';
import { makeChildPath } from './utils';

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
