import {
  atomWithStorage,
  createJSONStorage,
  unstable_withStorageValidator as withStorageValidator,
} from 'jotai/utils';

import { dateReviver } from './date-reviver';

/**
 * Local re-declaration of the Jotai sync-storage shape.
 *
 * Jotai 2.20's barrel `jotai/utils` does not re-export the `SyncStorage` / `SyncStringStorage`
 * type aliases (they live inside `jotai/vanilla/utils/atomWithStorage`, which is an internal
 * subpath we do not want to import from). The interface below is intentionally a structural
 * mirror of the public one; if Jotai widens the storage interface, we can either widen this
 * alias or switch to `ReturnType<typeof createJSONStorage<Value>>` (which is the same shape).
 */
type LocalStorageBackedStorage<Value> = {
  getItem: (key: string, initialValue: Value) => Value;
  setItem: (key: string, newValue: Value) => void;
  removeItem: (key: string) => void;
  subscribe?: (
    key: string,
    callback: (value: Value) => void,
    initialValue: Value,
  ) => (() => void) | undefined;
};

/**
 * Get a `localStorage`-backed string storage. Wrapped in a try/catch in case the
 * browser denies access (private mode, iframe, etc.) so that atom creation never throws.
 *
 * This mirrors Jotai's own internal `defaultStorage` factory, but allows us to substitute
 * the underlying storage in tests if needed.
 */
function getLocalStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('atomWithLocalStorage: localStorage is not accessible', e);
    }
    return undefined;
  }
}

/**
 * A module-level cache so all atoms share one event listener per page, regardless of
 * how many atoms subscribe. The Set-of-callbacks approach matches what `RecoilLocalStorageSync`
 * effectively achieved by mounting `RecoilSync` once at the App root.
 */
const subscriberMap = new Map<string, Set<(value: unknown) => void>>();
let storageEventInstalled = false;

function installStorageListener() {
  if (storageEventInstalled || typeof window === 'undefined') return;
  storageEventInstalled = true;

  window.addEventListener('storage', (event: StorageEvent) => {
    // Match the legacy listener semantics: only react to changes in `localStorage`
    // (not `sessionStorage`), and ignore wholesale `clear()` calls (where `event.key === null`).
    if (event.storageArea !== window.localStorage || event.key === null) return;

    const listeners = subscriberMap.get(event.key);
    if (!listeners?.size) return;

    let parsed: unknown;
    try {
      parsed = event.newValue === null ? undefined : JSON.parse(event.newValue, dateReviver);
    } catch {
      // Match the legacy warning so that diagnostics during migration are familiar.
      console.warn({ event }, 'atomWithLocalStorage: parseJSON failed');
      return;
    }

    for (const cb of listeners) cb(parsed);
  });
}

function addStorageSubscriber(key: string, callback: (value: unknown) => void) {
  let bucket = subscriberMap.get(key);
  if (!bucket) {
    bucket = new Set();
    subscriberMap.set(key, bucket);
  }
  bucket.add(callback);
  installStorageListener();

  return () => {
    bucket.delete(callback);
    if (bucket.size === 0) {
      subscriberMap.delete(key);
    }
  };
}

/**
 * Build a JSON-string-backed sync storage with date revival and cross-tab sync.
 *
 * Each item is stored under its own key in `localStorage` and serialized with
 * `JSON.stringify`. On read we revive ISO-8601 date strings into `Date` instances,
 * matching the previous `RecoilLocalStorageSync` behaviour.
 *
 * Cross-tab updates are delivered via the shared `storage`-event listener so that
 * a single window receives one event no matter how many atoms are subscribed.
 */
function makeLocalStorageBackend<Value>(): LocalStorageBackedStorage<Value> {
  const jsonStorage = createJSONStorage<Value>(getLocalStorage, { reviver: dateReviver });

  // `createJSONStorage` always returns SyncStorage when its factory returns sync storage,
  // but TS overloads can't narrow that, so we assert here.
  const sync = jsonStorage as LocalStorageBackedStorage<Value>;

  return {
    ...sync,
    subscribe: (key, callback, initialValue) => {
      return addStorageSubscriber(key, (value) => {
        callback(value === undefined ? initialValue : (value as Value));
      });
    },
  };
}

export interface AtomWithLocalStorageOptions<Value> {
  /**
   * Optional validator/type-guard for incoming values. Returning `false` causes the
   * atom to fall back to its initial value (matching the implicit behaviour of
   * `@recoiljs/refine` validators paired with `recoil-sync`).
   *
   * Typed as a TypeScript type predicate so callers can keep a `Value extends ...` shape.
   */
  validator?: (value: unknown) => value is Value;
  /**
   * Mirror of Jotai's `atomWithStorage`'s `getOnInit` option. Defaults to `true`,
   * so the atom hydrates synchronously on first read (matching `RecoilLocalStorageSync`
   * which read on mount).
   */
  getOnInit?: boolean;
}

/**
 * Create a Jotai atom whose value is persisted to `localStorage` under `key`.
 *
 * Replaces the combination of:
 *   - `RecoilLocalStorageSync` (the storeKey="local-storage" provider in App.tsx)
 *   - `syncEffect({ storeKey: 'local-storage', refine: ... })` on each atom.
 *
 * Differences from the Recoil version:
 *   - There is no shared "storeKey" anymore: each atom directly owns its localStorage slot.
 *     The `RecoilLocalStorageSync` component does not need to be mounted (and consequently
 *     can be removed from `App.tsx` once all consumers have migrated).
 *   - The validator is plain TypeScript (`(value: unknown) => value is Value`) instead of
 *     a `@recoiljs/refine` checker. Callers can either keep writing their refine checkers
 *     and wrap them in a tiny adapter, or rewrite as plain TypeScript guards.
 *
 * @param key localStorage key (formerly the recoil atom's `itemKey`)
 * @param initialValue default value when the key is absent or invalid
 * @param options optional validator and `getOnInit` flag
 */
export function atomWithLocalStorage<Value>(
  key: string,
  initialValue: Value,
  options: AtomWithLocalStorageOptions<Value> = {},
) {
  const { validator, getOnInit = true } = options;

  let storage: LocalStorageBackedStorage<Value> = makeLocalStorageBackend<Value>();

  if (validator) {
    storage = withStorageValidator(validator)(storage);
  }

  return atomWithStorage(key, initialValue, storage, { getOnInit });
}
