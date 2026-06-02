import { useAtomCallback } from 'jotai/utils';
import { FC, useCallback } from 'react';

import { StateWatcher } from '@/lib/jotai/StateWatcher';
import type { JotaiStateFamily } from '@/lib/jotai/types';

import { usePath, usePathChildren } from './context';
import { makeChildPath } from './utils';

export const EnforceSingleChild: FC<{
  attributeAtomFamily: JotaiStateFamily<boolean, string>;
}> = ({ attributeAtomFamily }) => {
  const path = usePath();
  const subPaths = usePathChildren(path);

  const enforceLimit = useAtomCallback(
    useCallback(
      (get, set, newShown: string) => {
        for (const sp of subPaths) {
          if (sp !== newShown) {
            set(attributeAtomFamily(makeChildPath(path, sp)), false);
          }
        }
      },
      [path, subPaths, attributeAtomFamily],
    ),
  );

  const handleChange = useCallback(
    (subPath: string, attributeValue: boolean) => {
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
          state={attributeAtomFamily(makeChildPath(path, sp))}
          onValue={(v) => handleChange(sp, v)}
        />
      ))}
    </>
  );
};
