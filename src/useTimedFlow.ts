import { useState, useRef, useCallback, useEffect } from "react";

export const useTimedFlow = ({
  steps,
  delay,
  autoStart = true,
  loop = false,
  onStepChange,
}: UseTimedFlowProps): UseTimedFlowReturn => {
  const [current, setCurrent] = useState(0);
  const [running, setRunning] = useState(autoStart);

  const timerRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(Date.now());
  const remainingRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(
    (ms: number = delay) => {
      clearTimer();
      startTsRef.current = Date.now();
      timerRef.current = window.setTimeout(() => {
        setCurrent((c) => {
          const nextIndex = c + 1;
          if (nextIndex >= steps) {
            if (loop) {
              scheduleNext(delay);
              return 0;
            }
            setRunning(false);
            return c;
          }
          scheduleNext(delay);
          return nextIndex;
        });
      }, ms);
    },
    [clearTimer, delay, loop, steps]
  );

  const pause = useCallback(() => {
    if (!running) return;
    clearTimer();
    const elapsed = Date.now() - startTsRef.current;
    remainingRef.current = Math.max(delay - elapsed, 0);
    setRunning(false);
  }, [clearTimer, delay, running]);

  const resume = useCallback(() => {
    if (running) return;
    const ms = remainingRef.current ?? delay;
    remainingRef.current = null;
    setRunning(true);
    scheduleNext(ms);
  }, [delay, running, scheduleNext]);

  const next = useCallback(() => {
    setCurrent((c) => {
      const nextIndex = c + 1;
      if (nextIndex >= steps) return loop ? 0 : c;
      return nextIndex;
    });
  }, [steps, loop]);

  const prev = useCallback(() => {
    setCurrent((c) => {
      const prevIndex = c - 1;
      if (prevIndex < 0) return loop ? steps - 1 : 0;
      return prevIndex;
    });
  }, [steps, loop]);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps) return;
      setCurrent(index);
    },
    [steps]
  );

  const reset = useCallback(
    (index: number = 0) => {
      clearTimer();
      setCurrent(index);
      remainingRef.current = null;
      setRunning(autoStart);
      if (autoStart) scheduleNext(delay);
    },
    [autoStart, clearTimer, delay, scheduleNext]
  );

  useEffect(() => {
    if (autoStart) scheduleNext();
    return clearTimer;
  }, [autoStart, scheduleNext, clearTimer]);

  useEffect(() => {
    onStepChange?.(current);
  }, [current, onStepChange]);

  return { current, running, pause, resume, reset, next, prev, goTo };
};
