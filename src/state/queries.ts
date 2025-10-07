import { FeatureOut } from '@nismod/irv-api-client';
import { selectorFamily } from 'recoil';

import { apiClient } from '@/api-client';

export const apiFeatureQuery = selectorFamily<FeatureOut, number>({
  key: 'apiFeatureQuery',
  get: (id: number) => async () => {
    const feature = await apiClient.features.featuresReadFeature({ featureId: id });
    return feature;
  },
});
