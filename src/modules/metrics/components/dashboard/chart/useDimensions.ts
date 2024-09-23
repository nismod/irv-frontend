import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export const useDimensions = (targetRef: any) => {
  const getDimensions = useCallback(() => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0,
    };
  }, [targetRef]);

  const [dimensions, setDimensions] = useState(getDimensions);

  const handleResize = useCallback(() => {
    setDimensions(getDimensions());
  }, [getDimensions]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useLayoutEffect(() => {
    handleResize();
  }, [handleResize]);

  return dimensions;
};
