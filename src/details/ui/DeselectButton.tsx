import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useResetAtom } from 'jotai/utils';

import { selectionAtomFamily } from '@/lib/data-map/interactions/interaction-state';

export const DeselectButton = ({ interactionGroup, title }) => {
  const clearSelection = useResetAtom(selectionAtomFamily(interactionGroup));

  return (
    <IconButton onClick={() => clearSelection()} title={title}>
      <Close />
    </IconButton>
  );
};
