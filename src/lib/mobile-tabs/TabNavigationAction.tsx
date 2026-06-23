import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { useAtomValue } from 'jotai';
import React, { ComponentType, FC } from 'react';

import { JotaiReadableStateFamily } from '@/lib/jotai/types';

/**
 * Custom BottomNavigationAction that gets disabled if the corresponding tab doesn't have any content.
 *
 */
export const TabNavigationAction: FC<{
  value: string;

  label: string;
  IconComponent: ComponentType<SvgIconProps>;

  selected?: boolean;
  showLabel?: boolean;
  onChange?: any;

  tabHasContentAtomFamily: JotaiReadableStateFamily<boolean, string>;
}> = ({ value, label, IconComponent, selected, showLabel, onChange, tabHasContentAtomFamily }) => {
  const hasContent = useAtomValue(tabHasContentAtomFamily(value));
  const disabled = !hasContent;

  // cloneElement is needed here because MUI BottomNavigation uses Children.map and cloneElement
  // and expects the children to be BottomNavigationActions, so this component needs to adapt to that
  // see @mui/material/BottomNavigation/BottomNavigation.js#L64
  return React.cloneElement(
    <BottomNavigationAction
      value={value}
      label={label}
      icon={<IconComponent fontSize="small" />}
      disabled={disabled}
      sx={
        selected
          ? undefined
          : {
              '&.Mui-disabled': {
                color: '#b2b2b2',
              },
            }
      }
      showLabel={showLabel}
      onChange={onChange}
    />,
    {
      selected,
    },
  );
};
