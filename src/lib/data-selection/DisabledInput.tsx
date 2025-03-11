import { createContext, FC, ReactNode, useContext } from 'react';

export const DisabledInputContext = createContext<boolean>(false);

export function useInputDisabled() {
  return useContext(DisabledInputContext);
}

export const DisabledInput: FC<{ disabled: boolean; children?: ReactNode }> = ({
  disabled,
  children,
}) => {
  return <DisabledInputContext.Provider value={disabled}>{children}</DisabledInputContext.Provider>;
};
