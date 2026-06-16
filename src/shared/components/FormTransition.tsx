import { ReactNode, useEffect, useRef, useState } from 'react';

const FORM_TRANSITION_MS = 220;

type TransitionState = 'entering' | 'entered' | 'exiting';

interface FormTransitionProps {
  children: ReactNode;
  isOpen?: boolean;
  transitionKey?: string | number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function transitionDuration() {
  return prefersReducedMotion() ? 1 : FORM_TRANSITION_MS;
}

function scheduleNextFrame(callback: () => void): number {
  if (typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(callback);
  }

  return window.setTimeout(callback, 16);
}

function cancelNextFrame(id: number | undefined) {
  if (id === undefined) return;

  if (typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(id);
    return;
  }

  window.clearTimeout(id);
}

export function FormTransition({
  children,
  isOpen = true,
  transitionKey,
  className = '',
  as: Element = 'div',
}: FormTransitionProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [state, setState] = useState<TransitionState>(isOpen ? 'entering' : 'exiting');
  const [renderedChildren, setRenderedChildren] = useState(children);
  const activeKeyRef = useRef(transitionKey);
  const timeoutRef = useRef<number>();
  const rafRef = useRef<number>();

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
      cancelNextFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    window.clearTimeout(timeoutRef.current);
    cancelNextFrame(rafRef.current);

    if (isOpen) {
      setShouldRender(true);
      setState('entering');
      rafRef.current = scheduleNextFrame(() => setState('entered'));
      return;
    }

    setState('exiting');
    timeoutRef.current = window.setTimeout(() => {
      setShouldRender(false);
    }, transitionDuration());
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender || activeKeyRef.current === transitionKey) {
      setRenderedChildren(children);
      activeKeyRef.current = transitionKey;
      return;
    }

    window.clearTimeout(timeoutRef.current);
    cancelNextFrame(rafRef.current);
    setState('exiting');

    timeoutRef.current = window.setTimeout(() => {
      activeKeyRef.current = transitionKey;
      setRenderedChildren(children);
      setState('entering');
      rafRef.current = scheduleNextFrame(() => setState('entered'));
    }, transitionDuration());
  }, [children, shouldRender, transitionKey]);

  if (!shouldRender) return null;

  return (
    <Element
      className={`form-transition ${className}`.trim()}
      data-state={state}
    >
      {renderedChildren}
    </Element>
  );
}
