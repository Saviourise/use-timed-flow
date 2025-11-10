import { renderHook, act } from "@testing-library/react-hooks";
import { useTimedFlow } from "../useTimedFlow";
import { vi, describe, afterEach, test, expect } from "vitest";

vi.useFakeTimers();

describe("useTimedFlow", () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });

  test("auto-advances steps with delay", () => {
    const { result } = renderHook(() =>
      useTimedFlow({ steps: 3, delay: 1000, autoStart: true })
    );

    expect(result.current.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.current).toBe(2);
  });

  test("pause and resume preserves remaining time", () => {
    const { result } = renderHook(() =>
      useTimedFlow({ steps: 2, delay: 2000, autoStart: true })
    );

    act(() => {
      vi.advanceTimersByTime(700);
      result.current.pause();
    });

    act(() => {
      // advancing while paused shouldn't change current
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.current).toBe(0);

    act(() => {
      result.current.resume();
      vi.advanceTimersByTime(1300); // remaining time
    });
    expect(result.current.current).toBe(1);
  });

  test("reset moves to the given index and respects autoStart", () => {
    const { result } = renderHook(() =>
      useTimedFlow({ steps: 4, delay: 500, autoStart: false })
    );

    act(() => {
      result.current.reset(2);
    });
    expect(result.current.current).toBe(2);
    expect(result.current.running).toBe(false);

    act(() => {
      result.current.resume();
      vi.advanceTimersByTime(500);
    });
    expect(result.current.current).toBe(3);
  });

  test("manual next and prev methods work correctly", () => {
    const { result } = renderHook(() =>
      useTimedFlow({ steps: 3, delay: 1000, autoStart: false })
    );

    expect(result.current.current).toBe(0);

    act(() => {
      result.current.next();
    });
    expect(result.current.current).toBe(1);

    act(() => {
      result.current.prev();
    });
    expect(result.current.current).toBe(0);

    act(() => {
      result.current.prev(); // at 0, no loop
    });
    expect(result.current.current).toBe(0);
  });

  test("manual goTo works correctly", () => {
    const { result } = renderHook(() =>
      useTimedFlow({ steps: 5, delay: 1000, autoStart: false })
    );

    act(() => {
      result.current.goTo(3);
    });
    expect(result.current.current).toBe(3);

    act(() => {
      result.current.goTo(10); // out of bounds, should ignore
    });
    expect(result.current.current).toBe(3);
  });

  test("looping works for next and prev", () => {
    const { result } = renderHook(() =>
      useTimedFlow({ steps: 3, delay: 1000, autoStart: false, loop: true })
    );

    act(() => {
      result.current.goTo(2);
      result.current.next(); // should loop to 0
    });
    expect(result.current.current).toBe(0);

    act(() => {
      result.current.prev(); // should loop to 2
    });
    expect(result.current.current).toBe(2);
  });

  test("multiple pause/resume cycles work correctly", () => {
    const { result } = renderHook(() =>
      useTimedFlow({ steps: 2, delay: 1000, autoStart: true })
    );

    act(() => {
      vi.advanceTimersByTime(400);
      result.current.pause();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
      result.current.resume();
    });

    act(() => {
      vi.advanceTimersByTime(600); // remaining time from first pause
    });
    expect(result.current.current).toBe(1);
  });
});
