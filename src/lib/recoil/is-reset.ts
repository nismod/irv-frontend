import { DefaultValue } from 'recoil';

/** Check if argument is an instance of Recoil `DefaultValue` */
export const isReset = (candidate: unknown): candidate is DefaultValue => {
  if (candidate instanceof DefaultValue) return true;
  return false;
};
