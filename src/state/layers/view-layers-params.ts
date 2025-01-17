import { GetRecoilValue } from 'recoil';

import { selectionState } from '@/lib/data-map/interactions/interaction-state';
import { makeViewLayerParamsState } from '@/lib/data-map/state/make-view-layer-params-state';
import { IrvViewLayerParams, ViewLayer } from '@/lib/data-map/view-layers';

import { viewLayersState } from './view-layers';

export const viewLayersParamsState = makeViewLayerParamsState<IrvViewLayerParams>({
  key: 'viewLayersParamsState',
  viewLayersState,
  getParamsForViewLayer:
    (viewLayer: ViewLayer) =>
    ({ get }) => ({
      selection: getSelectionParam(get, viewLayer),
      // add more view layer params here when they are added to the app
    }),
});

function getSelectionParam(get: GetRecoilValue, viewLayer: ViewLayer) {
  const interactionGroup = viewLayer.interactionGroup;
  const groupSelection = get(selectionState(interactionGroup));

  return groupSelection?.viewLayer.id === viewLayer.id ? groupSelection : null;
}
