import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminAnnouncementDetailPage from "../page";

const adminPageMocks = vi.hoisted(() => ({
  useAdminAuth: vi.fn(),
  useGetAnnouncementDetailQuery: vi.fn(),
  useGetClubDetailQuery: vi.fn(),
  useParams: vi.fn(),
  useQueryErrorToast: vi.fn(),
  useRouter: vi.fn(),
}));

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

vi.mock("next/navigation", () => ({
  useParams: adminPageMocks.useParams,
  useRouter: adminPageMocks.useRouter,
}));

vi.mock("shared", async () => {
  const actual = await vi.importActual<typeof import("shared")>("shared");

  return {
    ...actual,
    getMajorLabel: (major: string) => major,
  };
});

vi.mock("@/components/common", () => ({
  ClubHeader: () => <div>club header</div>,
}));

vi.mock("@/hooks/querys", () => ({
  useGetAnnouncementDetailQuery: adminPageMocks.useGetAnnouncementDetailQuery,
  useGetClubDetailQuery: adminPageMocks.useGetClubDetailQuery,
}));

vi.mock("@/hooks/useAdminAuth", () => ({
  useAdminAuth: adminPageMocks.useAdminAuth,
}));

vi.mock("@/hooks/useQueryErrorToast", () => ({
  useQueryErrorToast: adminPageMocks.useQueryErrorToast,
}));

vi.mock("sonner", () => ({
  toast: {
    warning: vi.fn(),
  },
}));

vi.mock("utils", () => ({
  getAnnouncementDeadlineEnd: vi.fn(
    (deadline: string | [number, number, number]) => {
      if (Array.isArray(deadline)) {
        return new Date(
          deadline[0],
          deadline[1] - 1,
          deadline[2],
          23,
          59,
          59,
          999,
        );
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
        const [year, month, day] = deadline.split("-").map(Number);
        return new Date(year, month - 1, day, 23, 59, 59, 999);
      }

      const parsedDate = new Date(deadline);
      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    },
  ),
}));

describe("AdminAnnouncementDetailPage", () => {
  beforeEach(() => {
    (Object.values(adminPageMocks) as Array<{ mockReset: () => void }>).forEach(
      (mock) => {
        mock.mockReset();
      },
    );

    const todayDeadline = formatLocalDate(new Date());

    adminPageMocks.useParams.mockReturnValue({
      announcementId: "1",
    });
    adminPageMocks.useRouter.mockReturnValue({
      push: vi.fn(),
    });
    adminPageMocks.useAdminAuth.mockReturnValue({
      isAuthorized: true,
      isBooting: false,
    });
    adminPageMocks.useGetAnnouncementDetailQuery.mockReturnValue({
      data: {
        applicationFormId: null,
        assignment: "- 과제 정리\n- 제출 전 점검",
        clubId: 1,
        deadline: todayDeadline,
        introduction: "## 공고 소개\n\n- TypeScript\n- React",
        major: ["FRONTEND"],
        phoneNumber: "01012345678",
        talentDescription: "**문제 해결**을 즐기는 사람",
        title: "관리자용 공고",
      },
      error: null,
      isLoading: false,
    });
    adminPageMocks.useGetClubDetailQuery.mockReturnValue({
      data: {
        club: {
          clubImage: "",
          clubName: "테스트 동아리",
          oneLiner: "한 줄 소개",
        },
      },
      error: null,
      isLoading: false,
    });
  });

  it("renders announcement markdown fields", () => {
    render(<AdminAnnouncementDetailPage />);

    expect(screen.getAllByText("공고 소개")).toHaveLength(2);
    expect(screen.getByText("TypeScript")).toBeTruthy();
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("문제 해결")).toBeTruthy();
    expect(screen.getByText("과제 정리")).toBeTruthy();
    expect(screen.getByText("제출 전 점검")).toBeTruthy();
  });

  it("keeps the apply button open on the deadline date", () => {
    render(<AdminAnnouncementDetailPage />);

    expect(
      screen.getByRole("button", { name: "지원서 작성하기" }),
    ).toBeVisible();
    expect(
      screen.queryByText("지원서 작성하기 (종료)"),
    ).not.toBeInTheDocument();
  });

  it("shows the expired state after the deadline date has passed", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    adminPageMocks.useGetAnnouncementDetailQuery.mockReturnValue({
      data: {
        applicationFormId: null,
        assignment: "- 과제 정리\n- 제출 전 점검",
        clubId: 1,
        deadline: formatLocalDate(yesterday),
        introduction: "## 공고 소개\n\n- TypeScript\n- React",
        major: ["FRONTEND"],
        phoneNumber: "01012345678",
        talentDescription: "**문제 해결**을 즐기는 사람",
        title: "관리자용 공고",
      },
      error: null,
      isLoading: false,
    });

    render(<AdminAnnouncementDetailPage />);

    expect(
      screen.getByRole("button", { name: "지원서 작성하기 (종료)" }),
    ).toBeVisible();
  });
});
