import { ApiClient } from '@nismod/irv-api-client';

import { FieldSpec } from '@/lib/data-map/view-layers';

/** Subscriber function that is called when a data loader is updated.  */
export type DataLoaderSubscriber = (loader: DataLoader) => void;

/** Class for managing the loading of additional attributes for map features from the IRV API.
 * A single DataLoader is responsible for managing the loading of a single attribute.
 */
export class DataLoader<T = any> {
  constructor(
    /** Unique ID of this loader */
    public readonly id: string,
    /** Data layer this loader is responsible for */
    public readonly layer: string,
    /** Specification of the field this loader is responsible for loading */
    public readonly fieldSpec: FieldSpec,
    /** Instance of an IRV API client to use for loading */
    public readonly apiClient: ApiClient,
  ) {}

  private _updateTrigger: number = 1;

  public get updateTrigger() {
    return this._updateTrigger;
  }

  /** Internal store of data per feature ID */
  private data: Map<number, T> = new Map();

  /** Set of feature IDs that have not been loaded yet */
  private missingIds: Set<number> = new Set();

  /** Set of feature IDs that are currently being loaded */
  private loadingIds: Set<number> = new Set();

  /** List of subscribers subscribed to this loader's updates */
  private subscribers: DataLoaderSubscriber[];

  /** Get data for a feature ID. If not loaded, adds the ID to missind IDs list, but returns `undefined` in the meantime. */
  getData(id: number) {
    const data = this.data.get(id);

    if (data === undefined) {
      this.missingIds.add(id);
    }

    return data;
  }

  /** Add a subscriber */
  subscribe(callback: DataLoaderSubscriber) {
    this.subscribers ??= [];
    this.subscribers.push(callback);
  }

  /** Remove a subscriber */
  unsubscribe(callback: DataLoaderSubscriber) {
    this.subscribers = this.subscribers?.filter((subscriber) => subscriber !== callback);
  }

  /** Clear loaded data, subscribers and all internal state */
  destroy() {
    this.subscribers = [];
    this.data.clear();
    this.missingIds.clear();
    this.loadingIds.clear();
  }

  /** Trigger loading of data for all IDs that have been currently flagged as missing. */
  async loadMissingData() {
    if (this.missingIds.size === 0) return;

    const tempMissingIds = Array.from(this.missingIds).filter((id) => !this.loadingIds.has(id));

    if (tempMissingIds.length === 0) return;

    const loadedData = await this.requestMissingData(tempMissingIds);

    this.updateData(loadedData);
  }

  /** Trigger loading of data for a provided list of IDs */
  async loadDataForIds(ids: number[]) {
    const tempMissingIds = ids.filter(
      (id) => this.data.get(id) === undefined && !this.loadingIds.has(id),
    );
    if (tempMissingIds.length === 0) return;

    const loadedData = await this.requestMissingData(tempMissingIds);
    this.updateData(loadedData);
  }

  private async requestMissingData(requestedIds: number[]): Promise<Record<string, T>> {
    const { fieldGroup, field, fieldDimensions, fieldParams } = this.fieldSpec;
    const missingIds = requestedIds.filter((id) => !this.loadingIds.has(id));

    if (missingIds.length === 0) return {};

    missingIds.forEach((id) => this.loadingIds.add(id));

    return await this.apiClient.attributes.attributesReadAttributes({
      layer: this.layer,
      fieldGroup,
      field,
      dimensions: JSON.stringify(fieldDimensions),
      parameters: JSON.stringify(fieldParams),
      requestBody: missingIds,
    });
  }

  private updateData(loadedData: Record<string, T>) {
    let newData = false;
    for (const [key, value] of Object.entries(loadedData)) {
      const numKey = parseInt(key, 10);
      if (this.data.get(numKey) === undefined) {
        newData = true;
        this.data.set(numKey, value);
      }

      this.missingIds.delete(numKey);
      this.loadingIds.delete(numKey);
    }

    if (newData) {
      this._updateTrigger += 1;
      this.subscribers?.forEach((subscriber) => subscriber(this));
    }
  }
}
