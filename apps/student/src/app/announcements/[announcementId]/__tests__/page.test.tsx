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

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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

describe("AnnouncementDetailPage", () => {
  beforeEach(() => {
    (
      Object.values(studentPageMocks) as Array<{ mockReset: () => void }>
    ).forEach((mock) => {
      mock.mockReset();
    });

    const todayDeadline = formatLocalDate(new Date());

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
        deadline: todayDeadline,
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

  it("keeps the apply button enabled until the end of the deadline date", async () => {
    render(
      <AnnouncementDetailPage
        params={Promise.resolve({ announcementId: "1" })}
      />,
    );

    expect(
      await screen.findByRole("link", { name: "지원서 작성하기" }),
    ).toBeVisible();
    expect(
      screen.queryByText("지원서 작성하기 (종료)"),
    ).not.toBeInTheDocument();
  });

  it("shows the expired apply button after the deadline date has passed", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    studentPageMocks.useGetDetailAnnounceQuery.mockReturnValue({
      data: {
        applicationFormId: null,
        assignment: "1. [과제 링크](https://example.com)\n2. 제출 기한 확인",
        clubId: 1,
        deadline: formatLocalDate(yesterday),
        introduction: "## 공고 소개\n\n- React\n- Next.js",
        major: ["FRONTEND"],
        phoneNumber: "01012345678",
        talentDescription: "**꾸준히** 학습하는 사람",
        title: "프론트 모집",
      },
      refetch: vi.fn(),
    });

    render(
      <AnnouncementDetailPage
        params={Promise.resolve({ announcementId: "1" })}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "지원서 작성하기 (종료)" }),
    ).toBeVisible();
  });
});
