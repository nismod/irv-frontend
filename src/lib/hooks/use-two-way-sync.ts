import { useEffect, useRef } from 'react';

export function useTwoWaySync<T>(
  [first, setFirst]: [T, (newVal: T) => void],
  [second, setSecond]: [T, (newVal: T) => void],
  isEqual: (a: T, b: T) => boolean = (a, b) => a === b,
) {
  const lastChangeRef = useRef<{ lastValue: T } | null>(null);

  useOneWaySync(first, setSecond, lastChangeRef, isEqual);

  useOneWaySync(second, setFirst, lastChangeRef, isEqual);
}

function useOneWaySync<T>(
  thisValue: T,
  setOtherValue: (newVal: T) => void,
  lastChangeRef: React.MutableRefObject<{ lastValue: T } | null>,
  isEqual: (a: T, b: T) => boolean,
) {
  useEffect(() => {
    const lastChange = lastChangeRef.current;
    if (lastChange == null) {
      setOtherValue(thisValue);
      lastChangeRef.current = { lastValue: thisValue };
    } else {
      const { lastValue } = lastChange;
      if (!isEqual(thisValue, lastValue)) {
        setOtherValue(thisValue);
        lastChangeRef.current = { lastValue: thisValue };
      } else {
        lastChangeRef.current = null;
      }
    }
  }, [thisValue, setOtherValue, isEqual, lastChangeRef]);
}
