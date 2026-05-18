import type { WritableAtom } from 'jotai';
import { atom } from 'jotai';
import { RESET } from 'jotai/utils';

/**
 * URL query-parameter sync layer for jotai atoms.
 *
 * Replacement for the combination of `RecoilURLSyncJSON` + `urlSyncEffect` that the
 * codebase currently uses under `storeKey="url-json"`.
 *
 * Design summary
 * --------------
 * - Each `atomWithUrlSync(...)` call returns a writable atom whose value is mirrored to
 *   a single query parameter of `window.location.search`.
 * - Values are JSON-encoded by default. That preserves wire compatibility with the
 *   existing `RecoilURLSyncJSON`-shaped URLs (e.g. `?z=10.5`, `?site=%22lat%2Clng%22`,
 *   `?sections=%7B...%7D`). Callers can pass a custom `serialize`/`deserialize` to opt out
 *   (the existing `mapZoomUrlState` etc. use a fixed-precision number serializer — see the
 *   `makeUrlNumberCodec` helper exposed alongside).
 * - Writes use `history.replaceState` by default. The previous implementation defaulted to
 *   `'replace'` for `sidebarSectionsUrlParamsState` and silently used `'push'` for others;
 *   to err on the side of fewer history entries we default to `'replace'`.
 * - On first mount we read the current URL value. Subsequent external URL changes
 *   (e.g. `popstate` from back/forward, programmatic `pushState`) propagate to subscribed
 *   atoms via a shared `popstate` listener.
 *
 * Multi-atom writes
 * -----------------
 * When several URL-synced atoms are set synchronously in the same tick, each one performs
 * its own `replaceState` against the current `window.location.search`. Because each
 * `replaceState` is synchronous, the next atom sees the already-updated URL — so the final
 * URL reflects every change. There is therefore no need for a coalescing "RecoilURLSyncJSON"
 * provider component.
 *
 * The previous implementation centralized this in `RecoilURLSyncJSON storeKey="url-json"`
 * which mounted at the App root. **That provider can be removed from `App.tsx` once all
 * URL-synced atoms have been migrated.**
 */

const URL_PARAM_ABSENT = Symbol('URL_PARAM_ABSENT');
type AbsentMarker = typeof URL_PARAM_ABSENT;

export type UrlSyncSerializer<Value> = (value: Value) => string | null;
export type UrlSyncDeserializer<Value> = (raw: string) => Value | AbsentMarker;

export interface AtomWithUrlSyncOptions<Value> {
  /**
   * Default value when the URL parameter is absent or fails to deserialize.
   */
  defaultValue: Value;
  /**
   * Custom serializer. Return `null` (or the default value, when `syncDefault: false`)
   * to remove the parameter from the URL. Default: `JSON.stringify`.
   */
  serialize?: UrlSyncSerializer<Value>;
  /**
   * Custom deserializer. Return `URL_PARAM_ABSENT` (re-exported from this module) to
   * indicate "treat as default". Default: `JSON.parse`, treating any parse failure as
   * absent.
   */
  deserialize?: UrlSyncDeserializer<Value>;
  /**
   * Whether the default value should be written to the URL when no value is set there
   * (matching `recoil-sync`'s `syncDefault` flag). Default `false`.
   */
  syncDefault?: boolean;
  /**
   * Whether to use `history.replaceState` (default) or `history.pushState`.
   */
  history?: 'replace' | 'push';
}

export { URL_PARAM_ABSENT };

/**
 * Default JSON-based serializer. Matches the wire format of `RecoilURLSyncJSON`.
 */
function defaultSerialize<Value>(value: Value): string | null {
  if (value === undefined) return null;
  return JSON.stringify(value);
}

/**
 * Default JSON-based deserializer. Treats parse failures as "absent".
 */
function defaultDeserialize<Value>(raw: string): Value | AbsentMarker {
  try {
    return JSON.parse(raw) as Value;
  } catch {
    return URL_PARAM_ABSENT;
  }
}

function readParam<Value>(
  key: string,
  deserialize: UrlSyncDeserializer<Value>,
): Value | AbsentMarker {
  if (typeof window === 'undefined') return URL_PARAM_ABSENT;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(key);
  if (raw === null) return URL_PARAM_ABSENT;
  return deserialize(raw);
}

function writeParam(key: string, encoded: string | null, historyMode: 'replace' | 'push') {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const before = params.toString();

  if (encoded === null) {
    if (!params.has(key)) return;
    params.delete(key);
  } else {
    if (params.get(key) === encoded) return;
    params.set(key, encoded);
  }

  const after = params.toString();
  if (before === after) return;

  const url = `${window.location.pathname}${after ? `?${after}` : ''}${window.location.hash}`;
  if (historyMode === 'push') {
    window.history.pushState(null, '', url);
  } else {
    window.history.replaceState(null, '', url);
  }
}

/**
 * A module-level popstate listener shared by every URL-synced atom. Each subscriber is
 * keyed by URL param name; we install the window listener lazily on first subscription.
 */
const popstateSubscribers = new Map<string, Set<() => void>>();
let popstateListenerInstalled = false;

function installPopstateListener() {
  if (popstateListenerInstalled || typeof window === 'undefined') return;
  popstateListenerInstalled = true;

  window.addEventListener('popstate', () => {
    for (const callbacks of popstateSubscribers.values()) {
      for (const cb of callbacks) cb();
    }
  });
}

function subscribeToPopstate(key: string, callback: () => void): () => void {
  let bucket = popstateSubscribers.get(key);
  if (!bucket) {
    bucket = new Set();
    popstateSubscribers.set(key, bucket);
  }
  bucket.add(callback);
  installPopstateListener();

  return () => {
    bucket.delete(callback);
    if (bucket.size === 0) {
      popstateSubscribers.delete(key);
    }
  };
}

/**
 * Build a writable atom whose value is mirrored to a single URL query parameter.
 *
 * @param key URL query parameter name (e.g. `'z'`, `'sections'`, `'site'`)
 * @param options serialization, default value and history mode
 */
export function atomWithUrlSync<Value>(
  key: string,
  options: AtomWithUrlSyncOptions<Value>,
): WritableAtom<Value, [Value | typeof RESET], void> {
  const {
    defaultValue,
    serialize = defaultSerialize as UrlSyncSerializer<Value>,
    deserialize = defaultDeserialize as UrlSyncDeserializer<Value>,
    syncDefault = false,
    history: historyMode = 'replace',
  } = options;

  // Hydrate synchronously from the URL so that the very first read of the atom returns
  // the URL-encoded value rather than the default. This mirrors `RecoilURLSyncJSON`'s
  // semantics of reading on mount.
  function readInitial(): Value {
    const fromUrl = readParam(key, deserialize);
    return fromUrl === URL_PARAM_ABSENT ? defaultValue : fromUrl;
  }

  const baseAtom = atom<Value>(readInitial());
  baseAtom.debugPrivate = true;

  baseAtom.onMount = (setSelf) => {
    // Re-read on mount in case the URL changed between atom creation and first use
    // (e.g. via routing). Also handle the `syncDefault` semantics.
    const fromUrl = readParam(key, deserialize);
    if (fromUrl === URL_PARAM_ABSENT) {
      if (syncDefault) {
        writeParam(key, serialize(defaultValue), historyMode);
      }
      setSelf(defaultValue);
    } else {
      setSelf(fromUrl);
    }

    return subscribeToPopstate(key, () => {
      const next = readParam(key, deserialize);
      setSelf(next === URL_PARAM_ABSENT ? defaultValue : next);
    });
  };

  const syncedAtom = atom<Value, [Value | typeof RESET], void>(
    (get) => get(baseAtom),
    (_get, set, update) => {
      if (update === RESET) {
        set(baseAtom, defaultValue);
        writeParam(key, syncDefault ? serialize(defaultValue) : null, historyMode);
        return;
      }
      set(baseAtom, update);
      writeParam(key, serialize(update), historyMode);
    },
  );

  return syncedAtom;
}

/**
 * Helper to build a fixed-precision number codec for URL sync.
 *
 * Mirrors the old `makeWriteNumber` helper that produces values like `?z=10.5` rather
 * than the more verbose JSON-encoded form. The output is parsed back as a number.
 */
export function makeUrlNumberCodec(maximumFractionDigits: number): {
  serialize: UrlSyncSerializer<number>;
  deserialize: UrlSyncDeserializer<number>;
} {
  return {
    serialize: (value) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return null;
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits,
        useGrouping: false,
      });
    },
    deserialize: (raw) => {
      const n = Number(raw);
      return Number.isNaN(n) ? URL_PARAM_ABSENT : n;
    },
  };
}

/**
 * Helper for sync-ing a plain string. Skips the JSON quoting of `defaultSerialize`,
 * making `?site=lat,lng` instead of `?site=%22lat%2Clng%22`.
 *
 * NOTE: this is *not* wire-compatible with the existing pixel-driller URL state. Adopt
 * it only when also changing how the URL is read elsewhere. Documented here so callers
 * have an obvious "I want a friendlier URL" path.
 */
export function makeUrlStringCodec(): {
  serialize: UrlSyncSerializer<string | null>;
  deserialize: UrlSyncDeserializer<string | null>;
} {
  return {
    serialize: (value) => (value == null || value === '' ? null : value),
    deserialize: (raw) => raw,
  };
}
