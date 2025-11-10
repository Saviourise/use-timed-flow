import React from "react";
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
      // advance while paused (shouldn't progress)
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.current).toBe(0);

    act(() => {
      result.current.resume();
      // remaining should be approximately 1300ms
      vi.advanceTimersByTime(1300);
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
});
