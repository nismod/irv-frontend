import _ from 'lodash';
import { useEffect } from 'react';

import { DataLoader } from '@/lib/data-loader/data-loader';
import { usePrevious } from '@/lib/hooks/use-previous';
import { useTrackingRef } from '@/lib/hooks/use-tracking-ref';
import { useTrigger } from '@/lib/hooks/use-trigger';

/**
 * Based on a list of data loaders extracted from view layers,
 * returns a number which can be used as a trigger to recalculate a list of deck layers.
 *
 */
export function useDataLoadTrigger(dataLoaders: DataLoader<any>[]) {
  const [dataLoadTrigger, doTriggerDataUpdate] = useTrigger();

  const previousLoaders = usePrevious(dataLoaders);

  useEffect(() => {
    // destroy removed data loaders to free up memory
    const removedLoaders = _.difference(previousLoaders ?? [], dataLoaders);
    removedLoaders.forEach((dl) => dl.destroy());

    // subscribe to new data loaders to get notified when data is loaded
    const addedLoaders = _.difference(dataLoaders, previousLoaders ?? []);
    addedLoaders.forEach((dl) => dl.subscribe(doTriggerDataUpdate));

    // if there was a change in data loaders, trigger an update to the data map
    if (addedLoaders.length > 0 || removedLoaders.length > 0) {
      doTriggerDataUpdate();
    }
  }, [dataLoaders, previousLoaders, doTriggerDataUpdate]);

  /* store current value of dataLoaders so that we can clean up data on component unmount
   * this is necessary because we don't want to keep the data loaders around after the component is unmounted
   */
  const currentLoadersRef = useTrackingRef(dataLoaders);
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      currentLoadersRef.current?.forEach((dl) => dl.destroy());
    };
  }, [currentLoadersRef]);

  return dataLoadTrigger;
}
