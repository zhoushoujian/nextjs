import { useRef } from 'react';

const usePrevious = (state, compare) => {
  const prevRef = useRef();
  const curRef = useRef();
  const needUpdate = typeof compare === 'function' ? compare(curRef.current, state) : true;

  if (needUpdate) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
};

export default usePrevious;
