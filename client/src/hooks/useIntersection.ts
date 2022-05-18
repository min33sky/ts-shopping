import { useEffect, RefObject, useRef, useState, useCallback } from 'react';

function useIntersection(targetRef: RefObject<HTMLElement>) {
  const observerRef = useRef<IntersectionObserver>();
  const [intersecting, setIntersecting] = useState(false);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        setIntersecting(entries[0]?.isIntersecting);
      });
    }
    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (targetRef.current) {
      getObserver().observe(targetRef.current);
    }
  }, [targetRef.current]);

  return intersecting;
}

export default useIntersection;
