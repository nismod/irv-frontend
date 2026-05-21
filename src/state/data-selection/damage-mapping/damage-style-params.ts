import { atom } from 'jotai';

import { FieldSpec, StyleParams } from '@/lib/data-map/view-layers';

import { DAMAGE_COLORMAP } from '@/config/damage-mapping/colors';

import { damageSourceAtom, damageTypeAtom } from './damage-map';

/**
 * Recoil↔Jotai migration: param values still live in Recoil `dataParamsByGroupState` (Slice 14).
 * `InfrastructureRiskSection` syncs the active damage-source group here.
 */
export const damageGroupParamsReplicaAtom = atom<Record<string, unknown>>({});

export const damagesFieldAtom = atom((get): FieldSpec | null => {
  const damageSource = get(damageSourceAtom);
  if (damageSource == null) return null;
  const damageType = get(damageTypeAtom);
  const damageParams = get(damageGroupParamsReplicaAtom);

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
