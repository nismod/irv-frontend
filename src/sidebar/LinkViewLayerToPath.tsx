import { FC } from 'react';
import { RecoilState } from 'recoil';

import { useHierarchicalVisibilityState } from '@/lib/data-selection/sidebar/context';
import { usePath } from '@/lib/paths/context';
import { useSyncValueToRecoil } from '@/lib/recoil/state-sync/use-sync-state';

/**
 * Component that reads the (hierarchical) visibility of the current path and syncs it to a given Recoil state.
 */
export const LinkViewLayerToPath: FC<{ state: RecoilState<boolean> }> = ({ state }) => {
  const path = usePath();
  const [visible] = useHierarchicalVisibilityState(path);
  useSyncValueToRecoil(visible, state);

  return null;
};
