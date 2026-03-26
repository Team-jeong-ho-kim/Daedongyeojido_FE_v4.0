import { render, screen, waitFor } from "@testing-library/react";
import TeacherMyPage from "../page";

const teacherPageMocks = vi.hoisted(() => ({
  clearTokens: vi.fn(),
  getAccessToken: vi.fn(),
  getSessionUser: vi.fn(),
  getTeacherClubCreationApplicationDetail: vi.fn(),
  getTeacherClubCreationApplications: vi.fn(),
  getTeacherMyInfo: vi.fn(),
  moveToWebLogin: vi.fn(),
  resolveClubCreationApplicationStatus: vi.fn(),
}));

vi.mock("utils", async () => {
  const actual = await vi.importActual<object>("utils");

  return {
    ...actual,
    apiClient: {
      delete: vi.fn(),
    },
    clearTokens: teacherPageMocks.clearTokens,
    getAccessToken: teacherPageMocks.getAccessToken,
    getSessionUser: teacherPageMocks.getSessionUser,
    resolveClubCreationApplicationStatus:
      teacherPageMocks.resolveClubCreationApplicationStatus,
  };
});

vi.mock("@/api/teacher", () => ({
  getTeacherClubCreationApplicationDetail:
    teacherPageMocks.getTeacherClubCreationApplicationDetail,
  getTeacherClubCreationApplications:
    teacherPageMocks.getTeacherClubCreationApplications,
  getTeacherMyInfo: teacherPageMocks.getTeacherMyInfo,
}));

vi.mock("@/lib/auth", () => ({
  moveToWebLogin: teacherPageMocks.moveToWebLogin,
}));

describe("TeacherMyPage", () => {
  beforeEach(() => {
    Object.values(teacherPageMocks).forEach((mock) => {
      mock.mockReset();
    });
  });

  it("redirects to web login when there is no valid teacher session", async () => {
    teacherPageMocks.getAccessToken.mockReturnValue(null);
    teacherPageMocks.getSessionUser.mockReturnValue(null);

    render(<TeacherMyPage />);

    await waitFor(() => {
      expect(teacherPageMocks.clearTokens).toHaveBeenCalled();
      expect(teacherPageMocks.moveToWebLogin).toHaveBeenCalled();
    });
  });

  it("renders matched applications when the session is valid", async () => {
    teacherPageMocks.getAccessToken.mockReturnValue("access");
    teacherPageMocks.getSessionUser.mockReturnValue({
      role: "TEACHER",
      userName: "김교사",
    });
    teacherPageMocks.getTeacherMyInfo.mockResolvedValue({
      accountId: "teacher01",
      teacherName: "김교사",
    });
    teacherPageMocks.getTeacherClubCreationApplications.mockResolvedValue([
      {
        applicantName: "홍길동",
        applicationId: 2,
        clubImage: null,
        clubName: "테스트동아리",
        introduction: "소개",
        lastSubmittedAt: "2026-03-21T10:00:00",
        majors: ["FE"],
        revision: 1,
        status: "UNDER_REVIEW",
      },
    ]);
    teacherPageMocks.getTeacherClubCreationApplicationDetail.mockResolvedValue({
      currentReviews: [],
      lastSubmittedAt: "2026-03-21T10:00:00",
      reviewHistory: [],
      revision: 1,
      status: "UNDER_REVIEW",
    });
    teacherPageMocks.resolveClubCreationApplicationStatus.mockReturnValue(
      "UNDER_REVIEW",
    );

    render(<TeacherMyPage />);

    await waitFor(() => {
      expect(screen.getByText("검토 신청 목록")).toBeVisible();
      expect(screen.getByText("테스트동아리")).toBeVisible();
      expect(screen.getByText("김교사")).toBeVisible();
    });
  });
});
