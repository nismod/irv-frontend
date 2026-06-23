import type { Atom } from 'jotai';
import { atom, useAtomValue } from 'jotai';
import { FC } from 'react';

/**
 * Mounts a jotai-effect atom so its side effect runs while this component is rendered.
 * Pass `active={false}` to disable without violating the rules of hooks.
 */
export const AtomEffectRoot: FC<{
  effectAtom: Atom<void>;
  active?: boolean;
}> = ({ effectAtom, active = true }) => {
  if (!active) {
    return null;
  }

  return <AtomEffectMount effectAtom={effectAtom} />;
};

const AtomEffectMount: FC<{ effectAtom: Atom<void> }> = ({ effectAtom }) => {
  useAtomValue(effectAtom);
  return null;
};
