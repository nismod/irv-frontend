import { atom, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { useEffect } from 'react';

/**
 * Per-tab boolean signalling whether the tab has content to display.
 *
 * The `tabId` parameter is a plain string, so the default reference-equality of
 * `atomFamily` is sufficient and we don't need a custom equality function.
 */
export const mobileTabHasContentAtomFamily = atomFamily((_tabId: string) => atom(false));

/**
 * Use this component to indicate that a tab in the mobile UI version has content.
 * The `tabId` should match one of the `id` fields in `mobileTabsConfig` in this file.
 */
export const MobileTabContentWatcher = ({ tabId }) => {
  const setTabHasContent = useSetAtom(mobileTabHasContentAtomFamily(tabId));

  useEffect(() => {
    setTabHasContent(true);

    return () => {
      setTabHasContent(false);
    };
  }, [setTabHasContent]);

  return null;
};
