import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminAnnouncementsPage from "../page";

const adminAnnouncementsMocks = vi.hoisted(() => ({
  useAdminAuth: vi.fn(),
  useGetAllAnnouncementsQuery: vi.fn(),
  useQueryErrorToast: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: adminAnnouncementsMocks.useRouter,
}));

vi.mock("@/hooks/querys", () => ({
  useGetAllAnnouncementsQuery:
    adminAnnouncementsMocks.useGetAllAnnouncementsQuery,
}));

vi.mock("@/hooks/useAdminAuth", () => ({
  useAdminAuth: adminAnnouncementsMocks.useAdminAuth,
}));

vi.mock("@/hooks/useQueryErrorToast", () => ({
  useQueryErrorToast: adminAnnouncementsMocks.useQueryErrorToast,
}));

vi.mock("@/components/common", () => ({
  Pagination: ({
    curPage,
    listLen,
    limit,
    setCurPage,
  }: {
    curPage: number;
    limit: number;
    listLen: number;
    setCurPage: (page: number) => void;
  }) => {
    const numPages = Math.ceil(listLen / limit);

    return (
      <div>
        {Array.from({ length: numPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              aria-pressed={curPage === page}
              onClick={() => setCurPage(page)}
            >
              {page}
            </button>
          );
        })}
      </div>
    );
  },
}));

const createAnnouncement = (
  announcementId: number,
  clubName: string,
  title = `공고 ${announcementId}`,
  clubImage = "",
) => ({
  announcementId,
  applicationFormId: null,
  clubImage,
  clubName,
  deadline: "2026-03-31",
  title,
});

describe("AdminAnnouncementsPage", () => {
  beforeEach(() => {
    (
      Object.values(adminAnnouncementsMocks) as Array<{
        mockReset: () => void;
      }>
    ).forEach((mock) => {
      mock.mockReset();
    });

    adminAnnouncementsMocks.useAdminAuth.mockReturnValue({
      isAuthorized: true,
      isBooting: false,
    });
    adminAnnouncementsMocks.useRouter.mockReturnValue({
      push: vi.fn(),
    });
    adminAnnouncementsMocks.useQueryErrorToast.mockReturnValue(undefined);
  });

  it("renders announcements latest-first and marks 전체 as active", () => {
    adminAnnouncementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [
        createAnnouncement(10, "백엔드", "최신 공고"),
        createAnnouncement(5, "프론트", "중간 공고"),
        createAnnouncement(
          2,
          "프론트",
          "오래된 공고",
          "https://example.com/front.png",
        ),
      ],
      error: null,
      isFetching: false,
      isLoading: false,
    });

    render(<AdminAnnouncementsPage />);

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
        .getAllByRole("heading", { level: 2 })
        .map((item) => item.textContent),
    ).toEqual(["최신 공고", "중간 공고", "오래된 공고"]);
  });

  it("filters announcements by selected club", () => {
    adminAnnouncementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
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
      error: null,
      isFetching: false,
      isLoading: false,
    });

    render(<AdminAnnouncementsPage />);

    fireEvent.click(screen.getByRole("button", { name: "프론트" }));

    expect(screen.getByRole("button", { name: "프론트" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("프론트 공고 2")).toBeVisible();
    expect(screen.getByText("프론트 공고 1")).toBeVisible();
    expect(screen.queryByText("백엔드 공고")).not.toBeInTheDocument();
  });

  it("resets pagination to the first page when the filter changes", () => {
    adminAnnouncementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
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
      error: null,
      isFetching: false,
      isLoading: false,
    });

    render(<AdminAnnouncementsPage />);

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("공고 1")).toBeVisible();
    expect(screen.queryByText("백엔드 공고 2")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "백엔드" }));

    expect(screen.getByText("백엔드 공고 2")).toBeVisible();
    expect(screen.getByText("백엔드 공고 1")).toBeVisible();
    expect(screen.queryByText("공고 1")).not.toBeInTheDocument();
  });

  it("restores the full list when 전체 filter is selected again", () => {
    adminAnnouncementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [
        createAnnouncement(1, "프론트", "프론트 공고"),
        createAnnouncement(2, "백엔드", "백엔드 공고"),
        createAnnouncement(3, "디자인", "디자인 공고"),
      ],
      error: null,
      isFetching: false,
      isLoading: false,
    });

    render(<AdminAnnouncementsPage />);

    fireEvent.click(screen.getByRole("button", { name: "백엔드" }));
    fireEvent.click(screen.getByRole("button", { name: "전체" }));

    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("프론트 공고")).toBeVisible();
    expect(screen.getByText("백엔드 공고")).toBeVisible();
    expect(screen.getByText("디자인 공고")).toBeVisible();
  });

  it("renders the global empty state when there are no announcements", () => {
    adminAnnouncementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [],
      error: null,
      isFetching: false,
      isLoading: false,
    });

    render(<AdminAnnouncementsPage />);

    expect(screen.getByText("공고가 없습니다.")).toBeVisible();
  });

  it("renders the filtered empty state when the selected club has no announcements", () => {
    adminAnnouncementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [
        createAnnouncement(2, "프론트", "프론트 공고"),
        createAnnouncement(1, "백엔드", "백엔드 공고"),
      ],
      error: null,
      isFetching: false,
      isLoading: false,
    });

    const { rerender } = render(<AdminAnnouncementsPage />);

    fireEvent.click(screen.getByRole("button", { name: "프론트" }));

    adminAnnouncementsMocks.useGetAllAnnouncementsQuery.mockReturnValue({
      data: [createAnnouncement(1, "백엔드", "백엔드 공고")],
      error: null,
      isFetching: false,
      isLoading: false,
    });

    rerender(<AdminAnnouncementsPage />);

    expect(screen.getByText("선택한 동아리의 공고가 없습니다.")).toBeVisible();
  });
});
