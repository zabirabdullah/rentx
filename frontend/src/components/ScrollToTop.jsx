import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      window.scrollTo(0, 0);
    } else {
      isMounted.current = true;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
