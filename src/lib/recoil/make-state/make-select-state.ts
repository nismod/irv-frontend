import { atom, RecoilValueReadOnly, selector } from 'recoil';

function firstElem<T>(options: T[]) {
  return options?.[0];
}

export type DefaultFunction<T> = (options: T[]) => T;

/**
 * Creates a compound Recoil state that selects from a list of options.
 */
export function makeSelectState<T>(
  /**
   * Recoil key prefix
   */
  key: string,
  /**
   * Recoil state containing the list of options
   */
  optionsState: RecoilValueReadOnly<T[]>,

  /**
   * Function to select the default value from the list of options
   */
  defaultFn: DefaultFunction<T> = firstElem,
) {
  const selectedImpl = atom({
    key: `${key}/impl`,
    default: null,
  });

  const defaultImpl = selector({
    key: `${key}/default`,
    get: ({ get }) => defaultFn(get(optionsState)),
  });

  const resultState = selector({
    key,
    get: ({ get }) => {
      const selectedOption = get(selectedImpl);
      const options = get(optionsState);
      if (selectedOption == null || !options.includes(selectedOption)) {
        return get(defaultImpl);
      }
      return selectedOption;
    },
    set: ({ set }, newValue) => set(selectedImpl, newValue),
  });

  return resultState;
}
