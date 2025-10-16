import { startTransition, useEffect, useRef, useState } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const currentRef = useRef(value);
  const isFirstRenderRef = useRef(true);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  useEffect(() => {
    const priorValue = currentRef.current;
    currentRef.current = value;

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    startTransition(() => {
      setPrevious(priorValue);
    });
  }, [value]);

  return previous;
}
