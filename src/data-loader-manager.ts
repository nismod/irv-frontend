import { DataLoaderManager } from '@/lib/data-loader/data-loader-manager';

import { apiClient } from './api-client';

export const dataLoaderManager = new DataLoaderManager(apiClient);
