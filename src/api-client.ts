import { AutoPkgClient } from '@nismod/irv-autopkg-client';

import { ApiClient } from './lib/api-client';

export const apiClient = new ApiClient({
  BASE: '/api',
});

export const autopkgClient = new AutoPkgClient({
  BASE: '/extract',
});
