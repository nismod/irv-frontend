// import { useEffect, useLayoutEffect, useState } from 'react';

export const useDimensions = (targetRef) => {
  const getDimensions = () => {
    return {
      width: targetRef.current ? targetRef.current.offsetWidth : 0,
      height: targetRef.current ? targetRef.current.offsetHeight : 0,
    };
  };

  // TODO add responsive styling
  // const [dimensions, setDimensions] = useState(getDimensions);

  // const handleResize = () => {
  //   setDimensions(getDimensions());
  // };

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, [handleResize]);

  // useLayoutEffect(() => {
  //   handleResize();
  // }, [handleResize]);

  // return dimensions;

  return getDimensions();
};
