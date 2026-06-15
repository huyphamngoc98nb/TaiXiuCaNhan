import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions = new Map<string, number>();

function requestRestoreFrame(callback: FrameRequestCallback) {
  if (typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(callback);
  }

  return window.setTimeout(() => callback(window.performance.now()), 0);
}

function cancelRestoreFrame(frameId: number) {
  if (typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(frameId);
    return;
  }

  window.clearTimeout(frameId);
}

export function useScrollRestoration<T extends HTMLElement>(scrollKey: string) {
  const containerRef = useRef<T>(null);
  const navigationType = useNavigationType();
  const location = useLocation();

  useLayoutEffect(() => {
    const savedScrollTop = navigationType === 'POP' ? (scrollPositions.get(scrollKey) ?? 0) : 0;
    let firstFrame: number | null = null;
    let secondFrame: number | null = null;

    const restoreScrollTop = () => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = savedScrollTop;
      }
    };

    restoreScrollTop();
    firstFrame = requestRestoreFrame(() => {
      restoreScrollTop();
      secondFrame = requestRestoreFrame(restoreScrollTop);
    });

    return () => {
      if (firstFrame !== null) {
        cancelRestoreFrame(firstFrame);
      }
      if (secondFrame !== null) {
        cancelRestoreFrame(secondFrame);
      }

      const container = containerRef.current;
      if (container) {
        scrollPositions.set(scrollKey, container.scrollTop);
      }
    };
  }, [location.key, navigationType, scrollKey]);

  return containerRef;
}
