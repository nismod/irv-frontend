import type { Getter, Setter } from 'jotai';

/** Read/write handle for imperative sync helpers and `jotai-effect` callbacks. */
export interface StoreOps {
  get: Getter;
  set: Setter;
}
