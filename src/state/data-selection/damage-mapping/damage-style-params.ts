import { atom } from 'jotai';

import { FieldSpec, StyleParams } from '@/lib/data-map/view-layers';

import { DAMAGE_COLORMAP } from '@/config/damage-mapping/colors';
import { dataParamsByGroupAtomFamily } from '@/state/data-params';

import { damageSourceAtom, damageTypeAtom } from './damage-map';

export const damagesFieldAtom = atom((get): FieldSpec | null => {
  const damageSource = get(damageSourceAtom);
  if (damageSource == null) return null;
  const damageType = get(damageTypeAtom);
  const damageParams = get(dataParamsByGroupAtomFamily(damageSource));

  return {
    fieldGroup: 'damages_expected',
    fieldDimensions: {
      hazard: damageSource,
      rcp: damageParams.rcp,
      epoch: damageParams.epoch,
      protection_standard: 0,
    },
    field: damageType === 'direct' ? 'ead_mean' : 'eael_mean',
  };
});

export const damageMapStyleParamsAtom = atom((get): StyleParams => {
  const eadFieldSpec = get(damagesFieldAtom);
  if (eadFieldSpec == null) return {};

  return {
    colorMap: {
      colorSpec: DAMAGE_COLORMAP,
      fieldSpec: eadFieldSpec,
    },
  };
});
