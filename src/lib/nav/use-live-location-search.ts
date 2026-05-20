import { useSyncExternalStore } from 'react';

const searchChangeListeners = new Set<() => void>();
let historyPatchInstalled = false;

function notifySearchChangeListeners() {
  for (const listener of searchChangeListeners) {
    listener();
  }
}

function installHistorySearchChangeListener() {
  if (historyPatchInstalled || typeof window === 'undefined') return;
  historyPatchInstalled = true;

  window.addEventListener('popstate', notifySearchChangeListeners);

  const { pushState, replaceState } = history;
  history.pushState = function (...args) {
    pushState.apply(this, args);
    notifySearchChangeListeners();
  };
  history.replaceState = function (...args) {
    replaceState.apply(this, args);
    notifySearchChangeListeners();
  };
}

function subscribeToLocationSearch(callback: () => void) {
  searchChangeListeners.add(callback);
  installHistorySearchChangeListener();
  return () => {
    searchChangeListeners.delete(callback);
  };
}

function getLocationSearch() {
  return window.location.search;
}

/**
 * Current query string, including updates from `history.replaceState` /
 * `pushState` that bypass React Router (e.g. Jotai `atomWithUrlSync` map coords).
 *
 * Prefer this over `useLocation().search` when building links that should reflect
 * the live URL bar.
 */
export function useLiveLocationSearch(): string {
  return useSyncExternalStore(subscribeToLocationSearch, getLocationSearch, () => '');
}
