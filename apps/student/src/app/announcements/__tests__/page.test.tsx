import { fireEvent, render, screen } from "@testing-library/react";
import AnnouncementsPage from "../page";

const announcementsMocks = vi.hoisted(() => ({
  useDeferredLoading: vi.fn(),
  useGetAllAnnouncementsQuery: vi.fn(),
  useRouter: vi.fn(),
  useUserStore: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: announcementsMocks.useRouter,
}));

vi.mock("shared", async () => {
  const actual = await vi.importActual<typeof import("shared")>("shared");

  return {
    ...actual,
    useUserStore: announcementsMocks.useUserStore,
  };
});

vi.mock("ui", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} type={props.type ?? "button"}>
      {children}
    </button>
  ),
  SkeletonAnnouncementCard: () => <div>loading skeleton</div>,
  useDeferredLoading: announcementsMocks.useDeferredLoading,
}));

vi.mock("@/hooks/querys/useAnnouncementQuery", () => ({
  useGetAllAnnouncementsQuery: announcementsMocks.useGetAllAnnouncementsQuery,
}));

vi.mock("@/components", async () => {
  const actual =
    await vi.importActual<typeof import("@/components")>("@/components");

  return {
    ...actual,
    AnnouncementItem: ({
      announcement_id,
      club_name,
      title,
    }: {
      announcement_id: number;
      club_name: string;
      title: string;
    }) => (
      <div data-testid={`announcement-${announcement_id}`}>
        {title} - {club_name}
      </div>
    ),
    CTASection: () => <div>cta section</div>,
  };
});

const createAnnouncement = (
  announcementId: number,
  clubName: string,
  title = `공고 ${announcementId}`,
  clubImage = "",
) => ({
  announcementId,
  clubImage,
  clubName,
  deadline: "2026-03-31",
  title,
});

describe("AnnouncementsPage", () => {
  beforeEach(() => {
    (
      Object.values(announcementsMocks) as Array<{ mockReset: () => void }>
    ).forEach((mock) => {
      mock.mockReset();
    });

    announcementsMocks.useDeferredLoading.mockReturnValue(false);
    announcementsMocks.useRouter.mockReturnValue({
      push: vi.fn(),
    });
    announcementsMocks.useUserStore.mockImplementation((selector) =>
      selector({
        userInfo: {
          role: "STUDENT",
        },
      }),
    );
  });

  it("renders announcements latest-first and marks 전체 as active", () => {
    announcementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [
        createAnnouncement(
          2,
          "프론트",
          "오래된 공고",
          "https://example.com/front.png",
        ),
        createAnnouncement(10, "백엔드", "최신 공고"),
        createAnnouncement(5, "프론트", "중간 공고"),
      ],
      isPending: false,
    });

    render(<AnnouncementsPage />);

    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("announcement-club-filter-scroll")).toHaveClass(
      "overflow-x-auto",
    );
    expect(screen.getByTestId("club-filter-all-icon")).toHaveAttribute(
      "src",
      "/images/clubs/all.svg",
    );
    expect(screen.getByTestId("club-filter-all-icon")).toHaveClass(
      "h-3.5",
      "w-3.5",
      "sm:h-4",
      "sm:w-4",
      "md:h-[18px]",
      "md:w-[18px]",
    );
    expect(screen.getByTestId("club-filter-logo-프론트")).toHaveAttribute(
      "src",
      expect.stringContaining(
        encodeURIComponent("https://example.com/front.png"),
      ),
    );
    expect(screen.getByTestId("club-filter-fallback-백엔드")).toHaveTextContent(
      "백",
    );
    expect(
      screen
        .getAllByTestId(/^announcement-\d+$/)
        .map((item) => item.textContent),
    ).toEqual([
      "최신 공고 - 백엔드",
      "중간 공고 - 프론트",
      "오래된 공고 - 프론트",
    ]);
  });

  it("filters announcements by selected club", () => {
    announcementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [
        createAnnouncement(
          1,
          "프론트",
          "프론트 공고 1",
          "https://example.com/front.png",
        ),
        createAnnouncement(2, "백엔드", "백엔드 공고"),
        createAnnouncement(3, "프론트", "프론트 공고 2"),
      ],
      isPending: false,
    });

    render(<AnnouncementsPage />);

    fireEvent.click(screen.getByRole("button", { name: "프론트" }));

    expect(screen.getByRole("button", { name: "프론트" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("프론트 공고 2 - 프론트")).toBeVisible();
    expect(screen.getByText("프론트 공고 1 - 프론트")).toBeVisible();
    expect(screen.queryByText("백엔드 공고 - 백엔드")).not.toBeInTheDocument();
  });

  it("resets pagination to the first page when the filter changes", () => {
    announcementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [
        createAnnouncement(9, "백엔드", "백엔드 공고 2"),
        createAnnouncement(8, "백엔드", "백엔드 공고 1"),
        createAnnouncement(7, "프론트"),
        createAnnouncement(6, "프론트"),
        createAnnouncement(5, "프론트"),
        createAnnouncement(4, "프론트"),
        createAnnouncement(3, "프론트"),
        createAnnouncement(2, "프론트"),
        createAnnouncement(1, "프론트"),
      ],
      isPending: false,
    });

    render(<AnnouncementsPage />);

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByTestId("announcement-1")).toBeVisible();
    expect(screen.queryByTestId("announcement-9")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "백엔드" }));

    expect(screen.getByTestId("announcement-9")).toBeVisible();
    expect(screen.getByTestId("announcement-8")).toBeVisible();
    expect(screen.queryByTestId("announcement-1")).not.toBeInTheDocument();
  });

  it("restores the full list when 전체 filter is selected again", () => {
    announcementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [
        createAnnouncement(1, "프론트", "프론트 공고"),
        createAnnouncement(2, "백엔드", "백엔드 공고"),
        createAnnouncement(3, "디자인", "디자인 공고"),
      ],
      isPending: false,
    });

    render(<AnnouncementsPage />);

    fireEvent.click(screen.getByRole("button", { name: "백엔드" }));

    fireEvent.click(screen.getByRole("button", { name: "전체" }));

    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("프론트 공고 - 프론트")).toBeVisible();
    expect(screen.getByText("백엔드 공고 - 백엔드")).toBeVisible();
    expect(screen.getByText("디자인 공고 - 디자인")).toBeVisible();
  });

  it("renders the global empty state when there are no announcements", () => {
    announcementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [],
      isPending: false,
    });

    render(<AnnouncementsPage />);

    expect(screen.getByText("공고가 없습니다.")).toBeVisible();
  });

  it("renders the filtered empty state when the selected club has no announcements", () => {
    announcementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [
        createAnnouncement(2, "프론트", "프론트 공고"),
        createAnnouncement(1, "백엔드", "백엔드 공고"),
      ],
      isPending: false,
    });

    const { rerender } = render(<AnnouncementsPage />);

    fireEvent.click(screen.getByRole("button", { name: "프론트" }));

    announcementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [createAnnouncement(1, "백엔드", "백엔드 공고")],
      isPending: false,
    });

    rerender(<AnnouncementsPage />);

    expect(screen.getByText("선택한 동아리의 공고가 없습니다.")).toBeVisible();
  });
});
