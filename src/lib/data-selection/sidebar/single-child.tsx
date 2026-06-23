import { useContext } from 'react';

import { EnforceSingleChild } from '@/lib/paths/EnforceSingleChild';

import { VisibilityStateContext } from './context';

export const EnforceSingleChildVisible = () => {
  const visibilityAtomFamily = useContext(VisibilityStateContext);

  return <EnforceSingleChild attributeAtomFamily={visibilityAtomFamily!} />;
};
