import { atom } from 'jotai';

import { HazardType } from '@/config/hazards/metadata';

/** Is the Infrastructure Risk sidebar section shown */
export const showInfrastructureRiskAtom = atom(false);

/** Should infrastructure layers visualise damage values */
export const showInfrastructureDamagesAtom = atom((get) => get(showInfrastructureRiskAtom));

export type DamageSource = HazardType;

export const damageSourceAtom = atom<DamageSource>('fluvial');

export const damageTypeAtom = atom<'direct' | 'indirect'>('direct');
