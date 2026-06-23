import type { WritableAtom } from 'jotai';
import { useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';

import { useHierarchicalVisibilityState } from '@/lib/data-selection/sidebar/context';
import { useSyncValueToAtom } from '@/lib/jotai/state-sync/use-sync-state';
import { usePath } from '@/lib/paths/context';

/**
 * Reads hierarchical path visibility and syncs it to a layer-visibility atom.
 */
export const LinkViewLayerToPath: FC<{
  atom: WritableAtom<boolean, [boolean], unknown>;
  /** Reset the linked atom to false when this component unmounts. */
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
