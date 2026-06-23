import { FeatureOut } from '@nismod/irv-api-client';
import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import { apiClient } from '@/api-client';

export const apiFeatureQueryAtomFamily = atomFamily((id: number) =>
  atom(async (): Promise<FeatureOut> => {
    return await apiClient.features.featuresReadFeature({ featureId: id });
  }),
);
