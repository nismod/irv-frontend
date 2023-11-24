import { Simplify } from 'type-fest';

/**
 * A type for an object containing a deck.gl property and
 * `updateTriggers` for that same property
 */
export type PropsWithTriggers<K extends string, P> = Simplify<
  {
    [key in K]: P;
  } & {
    updateTriggers: {
      [key in K]: any[];
    };
  }
>;
