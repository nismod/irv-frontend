import { KnownViewLayerSlots, ViewLayer } from '@/lib/data-map/view-layers';

import { ViewLayerContextProvider } from './react/ViewLayerContextProvider';

export const ViewLayerSlot = <
  SlotNameT extends keyof KnownViewLayerSlots,
  ParamsT extends object,
  StateT extends object,
>({
  viewLayer,
  slot,
  slotProps,
}: {
  viewLayer: ViewLayer<ParamsT, StateT>;
  slot: SlotNameT;
  slotProps: KnownViewLayerSlots[SlotNameT];
}) => {
  if (viewLayer.type === 'old') {
    throw new Error('ViewLayerSlot only supports new style view layers');
  }

  const SlotComponent = viewLayer.slots[slot] as
    | React.ComponentType<KnownViewLayerSlots[SlotNameT]>
    | undefined;

  if (SlotComponent) {
    SlotComponent.displayName = `${viewLayer.id}.${slot}`;
    return (
      <ViewLayerContextProvider viewLayer={viewLayer}>
        <SlotComponent {...slotProps} />
      </ViewLayerContextProvider>
    );
  } else return null;
};
