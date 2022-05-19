import { useEffect, RefObject, useRef, useState, useCallback } from 'react';

/**
 * Infiniry Scroll Hook
 * @param targetRef 무한 스크롤을 적용하기위해 감시할 DOM
 * @returns 뷰포트에 Target DOM이 감지가 되면 true 아니면 false
 */
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
