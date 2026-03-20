import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useDeferredLoading } from "./useDeferredLoading";

describe("useDeferredLoading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits for the configured delay before showing loading", () => {
    const { result, rerender } = renderHook(
      ({ delay, isLoading }) => useDeferredLoading(isLoading, delay),
      {
        initialProps: {
          delay: 200,
          isLoading: false,
        },
      },
    );

    expect(result.current).toBe(false);

    rerender({ delay: 200, isLoading: true });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it("resets immediately when loading finishes", () => {
    const { result, rerender } = renderHook(
      ({ isLoading }) => useDeferredLoading(isLoading, 50),
      {
        initialProps: {
          isLoading: true,
        },
      },
    );

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe(true);

    rerender({ isLoading: false });
    expect(result.current).toBe(false);
  });
});
