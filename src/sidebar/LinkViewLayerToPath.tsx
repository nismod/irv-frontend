import { FC } from 'react';
import { RecoilState, useRecoilState } from 'recoil';

import { useHierarchicalVisibilityState } from '@/lib/data-selection/sidebar/context';
import { useTwoWaySync } from '@/lib/hooks/use-two-way-sync';
import { usePath } from '@/lib/paths/context';

export const LinkViewLayerToPath: FC<{ state: RecoilState<boolean> }> = ({ state }) => {
  const path = usePath();
  const [visible, setVisible] = useHierarchicalVisibilityState(path);
  const [enabled, setEnabled] = useRecoilState(state);
  useTwoWaySync([visible, setVisible], [enabled, setEnabled]);

  return null;
};
