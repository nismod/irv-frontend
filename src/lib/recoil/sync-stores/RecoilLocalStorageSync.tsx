import { FC } from 'react';
import { DefaultValue } from 'recoil';
import { RecoilSync, RecoilSyncOptions } from 'recoil-sync';
import { SetOptional } from 'type-fest';

const DEFAULT_VALUE = new DefaultValue();

const readLocalStorage = (itemKey: string) => {
  const stringVal = localStorage.getItem(itemKey);
  if (stringVal == null) {
    return DEFAULT_VALUE;
  }
  return JSON.parse(stringVal);
};

const writeLocalStorage = ({ diff }) => {
  for (const [key, value] of diff) {
    if (value instanceof DefaultValue) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

export const RecoilLocalStorageSync: FC<SetOptional<RecoilSyncOptions, 'read' | 'write'>> = (
  props,
) => {
  return <RecoilSync read={readLocalStorage} write={writeLocalStorage} {...props} />;
};
