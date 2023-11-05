import { Layers, Palette, TableRows } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { ComponentType } from 'react';

import { DetailsContent } from '@/details/DetailsContent';
import { MapLegend } from '@/map/legend/MapLegend';
import { LayersSidebar } from '@/sidebar/LayersSidebar';

export interface TabConfig {
  id: string;
  label: string;
  IconComponent: ComponentType<SvgIconProps>;
  ContentComponent: ComponentType;
}

export const LAYERS_MOBILE_TAB_ID = 'layers';
export const LEGEND_MOBILE_TAB_ID = 'legend';
export const DETAILS_MOBILE_TAB_ID = 'details';

/**
 * A list of all tabs to display in mobile layout bottom sheet
 */
export const mobileTabsConfig: TabConfig[] = [
  {
    id: LAYERS_MOBILE_TAB_ID,
    label: 'Layers',
    IconComponent: Layers,
    ContentComponent: LayersSidebar,
  },
  {
    id: LEGEND_MOBILE_TAB_ID,
    label: 'Legend',
    IconComponent: Palette,
    ContentComponent: MapLegend,
  },
  {
    id: DETAILS_MOBILE_TAB_ID,
    label: 'Selection',
    IconComponent: TableRows,
    ContentComponent: DetailsContent,
  },
];
