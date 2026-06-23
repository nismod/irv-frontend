import { atom } from 'jotai';

/** Whether the map's place-search field is expanded/visible. */
export const placeSearchActiveAtom = atom<boolean>(false);

/** Current text in the map's place-search field. */
export const placeSearchQueryAtom = atom<string>('');
