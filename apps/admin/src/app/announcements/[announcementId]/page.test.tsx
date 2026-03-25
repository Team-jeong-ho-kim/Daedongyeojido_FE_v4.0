import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminAnnouncementDetailPage from "./page";

const adminPageMocks = vi.hoisted(() => ({
  useAdminAuth: vi.fn(),
  useGetAnnouncementDetailQuery: vi.fn(),
  useGetClubDetailQuery: vi.fn(),
  useParams: vi.fn(),
  useQueryErrorToast: vi.fn(),
  useRouter: vi.fn(),
}));

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

describe("AdminAnnouncementDetailPage", () => {
  beforeEach(() => {
    (Object.values(adminPageMocks) as Array<{ mockReset: () => void }>).forEach(
      (mock) => {
        mock.mockReset();
      },
    );

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
        deadline: "2026-03-31",
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
});
