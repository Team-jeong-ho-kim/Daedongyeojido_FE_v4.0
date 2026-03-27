import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const pageMocks = vi.hoisted(() => ({
  cancelMutateAsync: vi.fn(),
  deleteMutateAsync: vi.fn(),
  routerPush: vi.fn(),
  submitMutateAsync: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    use: () => ({ submissionId: "42" }),
  };
});

vi.mock("next/image", () => ({
  default: () => <div data-testid="mock-image" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pageMocks.routerPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === "from" ? "history" : null),
  }),
}));

vi.mock("shared", () => ({
  getMajorLabel: () => "프론트엔드",
}));

vi.mock("@/components/modal/ApplicationConfirmModal", () => ({
  ApplicationConfirmModal: ({
    cancelText,
    confirmText,
    description,
    isOpen,
    onClose,
    onConfirm,
    title,
  }: {
    cancelText: string;
    confirmText: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
  }) =>
    isOpen ? (
      <div>
        <p>{title}</p>
        <p>{description}</p>
        <button onClick={onConfirm} type="button">
          {confirmText}
        </button>
        <button onClick={onClose} type="button">
          {cancelText}
        </button>
      </div>
    ) : null,
}));

vi.mock("@/hooks/mutations/useApplicationForm", () => ({
  useCancelMySubmissionMutation: () => ({
    isPending: false,
    mutateAsync: pageMocks.cancelMutateAsync,
  }),
  useDeleteMySubmissionMutation: () => ({
    isPending: false,
    mutateAsync: pageMocks.deleteMutateAsync,
  }),
  useSubmitMySubmissionMutation: () => ({
    isPending: false,
    mutateAsync: pageMocks.submitMutateAsync,
  }),
}));

vi.mock("@/hooks/querys/useApplicationFormQuery", () => ({
  useGetMySubmissionDetailQuery: () => ({
    data: {
      classNumber: "2401",
      clubImage: "",
      clubName: "테스트 동아리",
      contents: [],
      introduction: "안녕하세요",
      major: "FE",
      submissionDuration: "2026-03-30",
      userApplicationStatus: "SUBMITTED",
      userName: "홍길동",
    },
    isError: false,
    isPending: false,
  }),
  useResultDurationQuery: () => ({
    data: null,
  }),
}));

vi.mock("@/hooks/useInvalidateQueriesAtResultTime", () => ({
  useInvalidateQueriesAtResultTime: vi.fn(),
}));

describe("MySubmissionDetailPage cancel flow", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    Object.values(pageMocks).forEach((mock) => {
      mock.mockReset();
    });
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const renderPage = async () => {
    const { default: MySubmissionDetailPage } = await import("../page");

    render(
      <MySubmissionDetailPage
        params={Promise.resolve({
          submissionId: "42",
        })}
      />,
    );
  };

  it("closes the modal after cancellation succeeds", async () => {
    pageMocks.cancelMutateAsync.mockResolvedValue(undefined);

    await renderPage();

    fireEvent.click(screen.getByRole("button", { name: "제출 취소하기" }));
    expect(screen.getByText("지원을 취소하시겠습니까?")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "취소하기" }));

    await waitFor(() => {
      expect(pageMocks.cancelMutateAsync).toHaveBeenCalledWith("42");
    });

    await waitFor(() => {
      expect(
        screen.queryByText("지원을 취소하시겠습니까?"),
      ).not.toBeInTheDocument();
    });
  });

  it("keeps the modal open after cancellation fails", async () => {
    pageMocks.cancelMutateAsync.mockRejectedValue(new Error("cancel failed"));

    await renderPage();

    fireEvent.click(screen.getByRole("button", { name: "제출 취소하기" }));
    expect(screen.getByText("지원을 취소하시겠습니까?")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "취소하기" }));

    await waitFor(() => {
      expect(pageMocks.cancelMutateAsync).toHaveBeenCalledWith("42");
    });

    expect(screen.getByText("지원을 취소하시겠습니까?")).toBeVisible();
    expect(pageMocks.routerPush).not.toHaveBeenCalled();
  });
});
