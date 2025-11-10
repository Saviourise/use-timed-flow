import { useState, useRef, useCallback, useEffect } from "react";

export interface UseTimedFlowProps {
  steps: number;
  delay: number; // ms
  autoStart?: boolean;
  loop?: boolean;
  onStepChange?: (current: number) => void;
}

export const useTimedFlow = ({
  steps,
  delay,
  autoStart = true,
  loop = false,
  onStepChange,
}: UseTimedFlowProps) => {
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
          const next = c + 1;
          if (next >= steps) {
            if (loop) {
              scheduleNext(delay); // chain again if looping
              return 0;
            }
            setRunning(false);
            return c;
          }
          scheduleNext(delay); // **auto-chain next step**
          return next;
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
    remainingRef.current = null; // consume remaining time
    setRunning(true);
    scheduleNext(ms);
  }, [delay, running, scheduleNext]);

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

  return { current, running, pause, resume, reset };
};
