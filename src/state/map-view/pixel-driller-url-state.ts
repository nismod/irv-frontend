import { atomWithUrlSync } from '@/lib/jotai/sync-stores/atom-with-url-sync';

/**
 * URL-synced state for the pixel driller "site" parameter.
 *
 * The value is stored in the URL query string as:
 *   site=<lat>,<lng>
 *
 * (JSON-encoded by RecoilURLSyncJSON, so the wire form is `?site=%22lat%2Clng%22`.)
 *
 * Internally we represent this as a string | null where:
 * - string: a "<lat>,<lng>" pair
 * - null: no site selected (param absent from URL)
 */
const INITIAL_PIXEL_DRILLER_SITE_URL: string | null = null;

export const pixelDrillerSiteUrlAtom = atomWithUrlSync('site', {
  defaultValue: INITIAL_PIXEL_DRILLER_SITE_URL,
  syncDefault: false,
  serialize: (value) => {
    if (value == null || value === '') return null;
    return JSON.stringify(value);
  },
});
