import { useContext } from 'react';

import { EnforceSingleChild } from '@/lib/paths/EnforceSingleChild';

import { VisibilityStateContext } from './context';

export const EnforceSingleChildVisible = () => {
  const visibilityState = useContext(VisibilityStateContext);

  return <EnforceSingleChild attributeState={visibilityState} />;
};
