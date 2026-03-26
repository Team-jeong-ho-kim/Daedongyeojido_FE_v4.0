import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentFilesSection } from "../DocumentFilesSection";

const documentsMocks = vi.hoisted(() => ({
  deleteMutateAsync: vi.fn(),
  downloadFileFromUrl: vi.fn(),
  queryHook: vi.fn(),
}));

vi.mock("@/hooks/querys", () => ({
  useGetDocumentFilesQuery: documentsMocks.queryHook,
}));

vi.mock("@/hooks/mutations", () => ({
  useDeleteClubCreationFormMutation: () => ({
    isPending: false,
    mutateAsync: documentsMocks.deleteMutateAsync,
  }),
}));

vi.mock("@/lib", async () => {
  const actual = await vi.importActual<object>("@/lib");
  return {
    ...actual,
    downloadFileFromUrl: documentsMocks.downloadFileFromUrl,
  };
});

vi.mock("ui", () => ({
  ManualPdfPreviewModal: ({
    fileName,
    isOpen,
  }: {
    fileName: string;
    isOpen: boolean;
  }) => (isOpen ? <div>preview modal:{fileName}</div> : null),
}));

describe("DocumentFilesSection", () => {
  beforeEach(() => {
    Object.values(documentsMocks).forEach((mock) => {
      mock.mockReset();
    });
  });

  it("renders the empty state when there are no files", () => {
    documentsMocks.queryHook.mockReturnValue({
      data: {
        fileResponses: [],
      },
      error: null,
      isError: false,
      isLoading: false,
    });

    render(<DocumentFilesSection />);

    expect(screen.getByText("등록된 양식이 없습니다.")).toBeVisible();
  });

  it("opens preview and delete flows for available files", async () => {
    const user = userEvent.setup();

    documentsMocks.queryHook.mockReturnValue({
      data: {
        fileResponses: [
          {
            fileId: 1,
            fileName: "2026 동아리 개설 신청 양식",
            fileUrl: "https://files.test/form.hwp",
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
    });

    render(<DocumentFilesSection />);

    await user.click(screen.getByRole("button", { name: "미리보기" }));
    expect(
      screen.getByText("preview modal:2026 동아리 개설 신청 양식.hwp"),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "삭제" }));
    expect(
      screen.getByRole("dialog", { name: "양식을 삭제하시겠습니까?" }),
    ).toBeVisible();

    await user.click(
      screen
        .getByRole("dialog", { name: "양식을 삭제하시겠습니까?" })
        .querySelectorAll("button")[1] as HTMLButtonElement,
    );

    expect(documentsMocks.deleteMutateAsync).toHaveBeenCalledWith(1);
  });
});
