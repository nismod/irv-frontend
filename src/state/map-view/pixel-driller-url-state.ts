import { string } from '@recoiljs/refine';
import { atom, DefaultValue } from 'recoil';
import { urlSyncEffect, WriteAtom } from 'recoil-sync';

/**
 * URL-synced state for the pixel driller "site" parameter.
 *
 * The value is stored in the URL query string as:
 *   site=<lat>,<lng>
 *
 * Internally we represent this as a string | null where:
 * - string: a "<lat>,<lng>" pair
 * - null: no site selected (param absent from URL)
 */
const writeSiteParam: WriteAtom<string | null> = ({ write, reset }, value) => {
  if (value instanceof DefaultValue || value == null || value === '') {
    reset('site');
  } else {
    write('site', value);
  }
};

export const pixelDrillerSiteUrlState = atom<string | null>({
  key: 'pixelDrillerSiteUrl',
  default: null,
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'site',
      refine: string(),
      write: writeSiteParam,
      // Do not write the default (null) into the URL – absence means "no site".
      syncDefault: false,
    }),
  ],
});
