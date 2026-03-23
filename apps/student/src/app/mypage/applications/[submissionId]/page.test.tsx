import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import MySubmissionDetailPage from "./page";

const detailPageMocks = vi.hoisted(() => ({
  deleteMutation: {
    isPending: false,
    mutateAsync: vi.fn(),
  },
  invalidateAtResultTime: vi.fn(),
  push: vi.fn(),
  resultDurationQuery: vi.fn(),
  searchParams: new URLSearchParams("from=history&status=SUBMITTED"),
  submissionDetailQuery: vi.fn(),
  submitMutation: {
    isPending: false,
    mutateAsync: vi.fn(),
  },
  cancelMutation: {
    isPending: false,
    mutateAsync: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: detailPageMocks.push,
  }),
  useSearchParams: () => detailPageMocks.searchParams,
}));

vi.mock("@/hooks/querys/useApplicationFormQuery", () => ({
  useGetMySubmissionDetailQuery: detailPageMocks.submissionDetailQuery,
  useResultDurationQuery: detailPageMocks.resultDurationQuery,
}));

vi.mock("@/hooks/mutations/useApplicationForm", () => ({
  useCancelMySubmissionMutation: () => detailPageMocks.cancelMutation,
  useDeleteMySubmissionMutation: () => detailPageMocks.deleteMutation,
  useSubmitMySubmissionMutation: () => detailPageMocks.submitMutation,
}));

vi.mock("@/hooks/useInvalidateQueriesAtResultTime", () => ({
  useInvalidateQueriesAtResultTime: detailPageMocks.invalidateAtResultTime,
}));

vi.mock("@/components/modal/ApplicationConfirmModal", () => ({
  ApplicationConfirmModal: () => null,
}));

describe("MySubmissionDetailPage", () => {
  beforeEach(() => {
    detailPageMocks.push.mockReset();
    detailPageMocks.invalidateAtResultTime.mockReset();
    detailPageMocks.submitMutation.mutateAsync.mockReset();
    detailPageMocks.deleteMutation.mutateAsync.mockReset();
    detailPageMocks.cancelMutation.mutateAsync.mockReset();
    detailPageMocks.searchParams = new URLSearchParams(
      "from=history&status=SUBMITTED",
    );
    detailPageMocks.resultDurationQuery.mockReturnValue({ data: null });
    detailPageMocks.submissionDetailQuery.mockReturnValue({
      data: {
        classNumber: "1101",
        clubImage: "",
        clubName: "테스트 동아리",
        contents: [
          {
            answer: "테스트 답변",
            applicationAnswerId: 1,
            applicationQuestionId: 1,
            question: "지원 동기",
          },
        ],
        introduction: "안녕하세요",
        major: "SW",
        submissionDuration: "2026-03-30",
        userName: "홍길동",
        user_application_status: "ACCEPTED",
      },
      isError: false,
      isPending: false,
    });
  });

  it("uses the server status instead of a stale status query param", async () => {
    await act(async () => {
      render(
        <MySubmissionDetailPage
          params={Promise.resolve({ submissionId: "42" })}
        />,
      );
    });

    expect(await screen.findByText("테스트 동아리")).toBeVisible();
    expect(screen.getByText("지원 내역")).toBeVisible();
    expect(screen.queryByRole("button", { name: "제출 취소하기" })).toBeNull();
    expect(screen.queryByRole("button", { name: "수정하기" })).toBeNull();
    expect(screen.queryByRole("button", { name: "제출하기" })).toBeNull();
    expect(screen.queryByRole("button", { name: "삭제하기" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "목록으로" }));

    expect(detailPageMocks.push).toHaveBeenCalledWith("/mypage/history");
  });
});
