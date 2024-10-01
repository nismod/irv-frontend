export type formatter = (
  n:
    | number
    | {
        valueOf(): number;
      },
) => string;
