import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useBoundingClientRect = () => {
  const ref = React.useRef(null);
  const resizeObserver = React.useRef(null);
  const [boundingClientRect, setBoundingClientRect] = React.useState();

  const updateBoundingClientRect = React.useCallback(() => {
    if (ref?.current) {
      const rect = ref.current.getBoundingClientRect();
      setBoundingClientRect(rect);
    }
  }, []);

  const setRef = React.useCallback(
    (nextRef) => {
      if (ref?.current) {
        resizeObserver.current && resizeObserver.current.unobserve(ref.current);
      }
      ref.current = nextRef;
      if (ref?.current) {
        updateBoundingClientRect();
        resizeObserver.current && resizeObserver.current.observe(ref.current);
      }
    },
    [updateBoundingClientRect]
  );

  React.useEffect(() => {
    window.addEventListener('resize', updateBoundingClientRect);
    window.addEventListener('scroll', updateBoundingClientRect);
    resizeObserver.current = new ResizeObserver((entries) => {
      if (ref?.current) {
        const currentRefEntry = entries.find(
          ({ target }) => target === ref.current
        );
        if (currentRefEntry) {
          updateBoundingClientRect();
        }
      }
    });
    if (ref?.current) {
      resizeObserver.current.observe(ref.current);
    }
    return () => {
      window.removeEventListener('resize', updateBoundingClientRect);
      window.removeEventListener('scroll', updateBoundingClientRect);
      resizeObserver.current.disconnect();
      resizeObserver.current = null;
    };
  }, [updateBoundingClientRect]);

  return { ref: setRef, useRef: ref, boundingClientRect };
};

export default useBoundingClientRect;
