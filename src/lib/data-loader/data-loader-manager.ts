import { ApiClient } from '@nismod/irv-api-client';
import stringify from 'json-stable-stringify';

import { FieldSpec } from '@/lib/data-map/view-layers';

import { DataLoader } from './data-loader';

/** Generate a unique key for a `layer` and `fieldSpec` */
function getLoaderKey(layer: string, fieldSpec: FieldSpec) {
  return `${layer}__${stringify(fieldSpec)}`;
}

/** Class for managing multiple data loaders. */
export class DataLoaderManager {
  private loaders: { [key: string]: DataLoader } = {};
  private nextLoaderId = 0;

  constructor(
    /** Instance of IRV API client to pass to data loaders */
    public readonly apiClient: ApiClient,
  ) {}

  /** Get the data loader for layer/fieldSpec combination. If not present, create it. */
  public getDataLoader(layer: string, fieldSpec: FieldSpec) {
    const loaderKey = getLoaderKey(layer, fieldSpec);
    if (this.loaders[loaderKey] == null) {
      const loader = new DataLoader(this.nextLoaderId.toString(), layer, fieldSpec, this.apiClient);
      this.nextLoaderId += 1;
      this.loaders[loaderKey] = loader;
    }
    return this.loaders[loaderKey];
  }

  /** Remove the data loader for layer/fieldSpec combination (if exists). */
  public clearDataLoader(layer: string, fieldSpec: FieldSpec) {
    const loaderKey = getLoaderKey(layer, fieldSpec);

    if (this.loaders[loaderKey] != null) {
      this.loaders[loaderKey].destroy();
      delete this.loaders[loaderKey];
    }
  }
}
