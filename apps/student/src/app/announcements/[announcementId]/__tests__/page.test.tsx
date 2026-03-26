import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AnnouncementDetailPage from "../page";

const studentPageMocks = vi.hoisted(() => ({
  useDeleteAnnouncementMutation: vi.fn(),
  useGetClubApplicationFormsQuery: vi.fn(),
  useGetDetailAnnounceQuery: vi.fn(),
  useGetDetailClubQuery: vi.fn(),
  usePublishAnnouncementMutation: vi.fn(),
  useRouter: vi.fn(),
  useUserStore: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    use: (value: unknown) => {
      if (value && typeof value === "object" && "then" in value) {
        return { announcementId: "1" };
      }

      return value;
    },
  };
});

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: studentPageMocks.useRouter,
}));

vi.mock("shared", async () => {
  const actual = await vi.importActual<typeof import("shared")>("shared");

  return {
    ...actual,
    getMajorLabel: (major: string) => major,
    useUserStore: studentPageMocks.useUserStore,
  };
});

vi.mock("@/api/applicationForm", () => ({
  getApplicationSubmissions: vi.fn(),
}));

vi.mock("@/components", () => ({
  ApplicantCard: () => <div>applicant card</div>,
  ApplicationConfirmModal: () => null,
  ClubHeader: () => <div>club header</div>,
  Pagination: () => <div>pagination</div>,
}));

vi.mock("@/components/modal/ApplicationFormSelectModal", () => ({
  ApplicationFormSelectModal: () => null,
}));

vi.mock("@/hooks/mutations/useAnnouncement", () => ({
  useDeleteAnnouncementMutation: studentPageMocks.useDeleteAnnouncementMutation,
  usePublishAnnouncementMutation:
    studentPageMocks.usePublishAnnouncementMutation,
}));

vi.mock("@/hooks/querys/useAnnouncementQuery", () => ({
  useGetDetailAnnounceQuery: studentPageMocks.useGetDetailAnnounceQuery,
}));

vi.mock("@/hooks/querys/useApplicationFormQuery", () => ({
  useGetClubApplicationFormsQuery:
    studentPageMocks.useGetClubApplicationFormsQuery,
}));

vi.mock("@/hooks/querys/useClubQuery", () => ({
  useGetDetailClubQuery: studentPageMocks.useGetDetailClubQuery,
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("utils", () => ({
  getAccessToken: vi.fn(() => null),
}));

describe("AnnouncementDetailPage", () => {
  beforeEach(() => {
    (
      Object.values(studentPageMocks) as Array<{ mockReset: () => void }>
    ).forEach((mock) => {
      mock.mockReset();
    });

    studentPageMocks.useRouter.mockReturnValue({
      push: vi.fn(),
    });
    studentPageMocks.useUserStore.mockImplementation((selector) =>
      selector({
        userInfo: {
          clubName: "",
          role: "STUDENT",
        },
      }),
    );
    studentPageMocks.useDeleteAnnouncementMutation.mockReturnValue({
      mutate: vi.fn(),
    });
    studentPageMocks.usePublishAnnouncementMutation.mockReturnValue({
      mutate: vi.fn(),
    });
    studentPageMocks.useGetClubApplicationFormsQuery.mockReturnValue({
      data: [],
    });
    studentPageMocks.useGetDetailAnnounceQuery.mockReturnValue({
      data: {
        applicationFormId: null,
        assignment: "1. [과제 링크](https://example.com)\n2. 제출 기한 확인",
        clubId: 1,
        deadline: "2026-03-31",
        introduction: "## 공고 소개\n\n- React\n- Next.js",
        major: ["FRONTEND"],
        phoneNumber: "01012345678",
        talentDescription: "**꾸준히** 학습하는 사람",
        title: "프론트 모집",
      },
      refetch: vi.fn(),
    });
    studentPageMocks.useGetDetailClubQuery.mockReturnValue({
      data: {
        club: {
          clubImage: "",
          clubName: "테스트 동아리",
          oneLiner: "한 줄 소개",
        },
      },
    });
  });

  it("renders announcement fields as markdown", async () => {
    render(
      <AnnouncementDetailPage
        params={Promise.resolve({ announcementId: "1" })}
      />,
    );

    expect(await screen.findByText("React")).toBeVisible();
    expect(screen.getByText("Next.js")).toBeVisible();
    expect(screen.getByText("꾸준히")).toBeVisible();
    expect(screen.getByRole("link", { name: "과제 링크" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByText("제출 기한 확인")).toBeVisible();
  });
});
