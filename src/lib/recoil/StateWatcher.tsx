import { useEffect } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';

/**
 * A component that watches a Recoil state and calls a callback with the current value.
 * Simpler alternative to StateEffectRoot.
 */
export function StateWatcher<T>({
  state,
  onValue,
}: {
  state: RecoilState<T>;
  onValue: (value: T) => void;
}) {
  const value = useRecoilValue(state);

  useEffect(() => {
    onValue(value);
  }, [onValue, value]);

  return null;
}
