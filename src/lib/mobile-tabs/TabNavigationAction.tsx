import { BottomNavigationAction, SvgIconProps } from '@mui/material';
import React, { ComponentType, FC } from 'react';
import { useRecoilValue } from 'recoil';

import { RecoilReadableStateFamily } from '@/lib/recoil/types';

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

  tabHasContentState: RecoilReadableStateFamily<boolean, string>;
}> = ({ value, label, IconComponent, selected, showLabel, onChange, tabHasContentState }) => {
  const hasContent = useRecoilValue(tabHasContentState(value));
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
