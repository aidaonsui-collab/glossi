import { useEffect, useState } from 'react';

export function useNarrow(breakpoint = 720) {
  const get = () => typeof window !== 'undefined' && window.innerWidth <= breakpoint;
  const [narrow, setNarrow] = useState(get);
  useEffect(() => {
    const onResize = () => setNarrow(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return narrow;
}
