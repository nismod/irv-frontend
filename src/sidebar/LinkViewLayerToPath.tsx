import type { WritableAtom } from 'jotai';
import { useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { RecoilState, useSetRecoilState } from 'recoil';

import { useHierarchicalVisibilityState } from '@/lib/data-selection/sidebar/context';
import { useSyncValueToAtom } from '@/lib/jotai/state-sync/use-sync-state';
import { usePath } from '@/lib/paths/context';
import { useSyncValueToRecoil } from '@/lib/recoil/state-sync/use-sync-state';

type LinkViewLayerToPathCommon = {
  /** Reset the linked atom/state to false when this component unmounts. */
  resetOnUnmount?: boolean;
};

type LinkViewLayerToPathProps =
  | ({ state: RecoilState<boolean>; atom?: never } & LinkViewLayerToPathCommon)
  | ({
      atom: WritableAtom<boolean, [boolean], unknown>;
      state?: never;
    } & LinkViewLayerToPathCommon);

/**
 * Reads hierarchical path visibility and syncs it to a layer-visibility flag.
 * Accepts either a Recoil state (legacy) or a Jotai atom (migrated slices).
 */
export const LinkViewLayerToPath: FC<LinkViewLayerToPathProps> = (props) => {
  if ('atom' in props && props.atom) {
    return <LinkViewLayerToPathJotai atom={props.atom} resetOnUnmount={props.resetOnUnmount} />;
  }
  return <LinkViewLayerToPathRecoil state={props.state} resetOnUnmount={props.resetOnUnmount} />;
};

const LinkViewLayerToPathRecoil: FC<{
  state: RecoilState<boolean>;
  resetOnUnmount?: boolean;
}> = ({ state, resetOnUnmount }) => {
  const path = usePath();
  const [visible] = useHierarchicalVisibilityState(path);
  const setState = useSetRecoilState(state);
  useSyncValueToRecoil(visible, state);

  useEffect(() => {
    if (!resetOnUnmount) return;
    return () => {
      setState(false);
    };
  }, [resetOnUnmount, setState]);

  return null;
};

const LinkViewLayerToPathJotai: FC<{
  atom: WritableAtom<boolean, [boolean], unknown>;
  resetOnUnmount?: boolean;
}> = ({ atom, resetOnUnmount }) => {
  const path = usePath();
  const [visible] = useHierarchicalVisibilityState(path);
  const setAtom = useSetAtom(atom);
  useSyncValueToAtom(visible, atom);

  useEffect(() => {
    if (!resetOnUnmount) return;
    return () => {
      setAtom(false);
    };
  }, [resetOnUnmount, setAtom]);

  return null;
};
