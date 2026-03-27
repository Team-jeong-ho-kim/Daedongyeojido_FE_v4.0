import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { ApiError } from "utils";

const mutationMocks = vi.hoisted(() => ({
  cancelMySubmission: vi.fn(),
  routerPush: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mutationMocks.routerPush,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: mutationMocks.toastError,
    success: mutationMocks.toastSuccess,
  },
}));

vi.mock("@/api/applicationForm", () => ({
  cancelMySubmission: mutationMocks.cancelMySubmission,
  decidePass: vi.fn(),
  deleteApplicationForm: vi.fn(),
  deleteDocumentFile: vi.fn(),
  deleteMySubmission: vi.fn(),
  submitApplication: vi.fn(),
  submitMySubmission: vi.fn(),
  updateMySubmission: vi.fn(),
}));

import { useCancelMySubmissionMutation } from "../useApplicationForm";

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCancelMySubmissionMutation", () => {
  beforeEach(() => {
    Object.values(mutationMocks).forEach((mock) => {
      mock.mockReset();
    });
  });

  it("shows the server description when cancellation is rejected by the API", async () => {
    mutationMocks.cancelMySubmission.mockRejectedValue(
      new ApiError(
        "면접 일정이 생성되어 지원 취소를 할 수 없습니다.",
        400,
        "2026-03-27T00:00:00.000Z",
        "Bad Request",
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    });

    const { result } = renderHook(() => useCancelMySubmissionMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(result.current.mutateAsync("42")).rejects.toBeInstanceOf(
      ApiError,
    );

    await waitFor(() => {
      expect(mutationMocks.toastError).toHaveBeenCalledWith(
        "면접 일정이 생성되어 지원 취소를 할 수 없습니다.",
      );
    });
  });

  it("falls back to the generic message for unexpected errors", async () => {
    mutationMocks.cancelMySubmission.mockRejectedValue(new Error("network"));

    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    });

    const { result } = renderHook(() => useCancelMySubmissionMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(result.current.mutateAsync("42")).rejects.toThrow("network");

    await waitFor(() => {
      expect(mutationMocks.toastError).toHaveBeenCalledWith(
        "지원 취소에 실패했습니다. 다시 시도해주세요.",
      );
    });
  });

  it("shows success feedback and redirects after cancellation succeeds", async () => {
    mutationMocks.cancelMySubmission.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    });

    const { result } = renderHook(() => useCancelMySubmissionMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync("42");

    await waitFor(() => {
      expect(mutationMocks.toastSuccess).toHaveBeenCalledWith(
        "지원이 취소되었습니다.",
      );
      expect(mutationMocks.routerPush).toHaveBeenCalledWith(
        "/mypage/applications",
      );
    });
  });
});
