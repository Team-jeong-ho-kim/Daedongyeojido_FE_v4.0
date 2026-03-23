import {
  QueryClient,
  QueryClientProvider,
  type QueryKey,
} from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { act } from "react";
import { useInvalidateQueriesAtResultTime } from "./useInvalidateQueriesAtResultTime";

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useInvalidateQueriesAtResultTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-23T09:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("schedules query invalidation for the result time", () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const invalidateQueryKeys: QueryKey[] = [["applications", "history"]];

    renderHook(
      () =>
        useInvalidateQueriesAtResultTime({
          invalidateQueryKeys,
          resultDuration: "2026-03-23T09:00:10.000Z",
        }),
      { wrapper: createWrapper(queryClient) },
    );

    act(() => {
      vi.advanceTimersByTime(9_999);
    });
    expect(invalidateQueries).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["applications", "history"],
    });
  });

  it("invalidates immediately when the result time already passed", () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    renderHook(
      () =>
        useInvalidateQueriesAtResultTime({
          invalidateQueryKeys: [["applications", "detail", "42"]],
          resultDuration: "2026-03-23T08:59:59.000Z",
        }),
      { wrapper: createWrapper(queryClient) },
    );

    expect(invalidateQueries).toHaveBeenCalledTimes(1);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["applications", "detail", "42"],
    });
  });

  it("does nothing when result duration is absent or invalid", () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    const { rerender } = renderHook(
      ({ resultDuration }: { resultDuration: string | null }) =>
        useInvalidateQueriesAtResultTime({
          invalidateQueryKeys: [["applications", "history"]],
          resultDuration,
        }),
      {
        initialProps: { resultDuration: null },
        wrapper: createWrapper(queryClient),
      },
    );

    rerender({ resultDuration: "not-a-date" });

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
