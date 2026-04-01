import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { canEditInterviewScheduleForRole } from "../permissions";

const submissionPageMocks = vi.hoisted(() => ({
  completeInterview: vi.fn(),
  createInterviewSchedule: vi.fn(),
  decidePass: vi.fn(),
  getInterviewSchedule: vi.fn(),
  getSubmissionDetail: vi.fn(),
  routerBack: vi.fn(),
  useUserStore: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    use: (value: unknown) => {
      if (value && typeof value === "object" && "then" in value) {
        return { submissionId: "308" };
      }

      return value;
    },
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: submissionPageMocks.routerBack,
  }),
}));

vi.mock("shared", async () => {
  const actual = await vi.importActual<typeof import("shared")>("shared");

  return {
    ...actual,
    getMajorLabel: (major: string) => major,
    useUserStore: submissionPageMocks.useUserStore,
  };
});

vi.mock("@/api/applicationForm", () => ({
  completeInterview: submissionPageMocks.completeInterview,
  createInterviewSchedule: submissionPageMocks.createInterviewSchedule,
  decidePass: submissionPageMocks.decidePass,
  getInterviewSchedule: submissionPageMocks.getInterviewSchedule,
  getSubmissionDetail: submissionPageMocks.getSubmissionDetail,
}));

vi.mock("@/components/modal/ApplicationConfirmModal", () => ({
  ApplicationConfirmModal: () => null,
}));

vi.mock("@/components/modal/InterviewScheduleSetModal", () => ({
  InterviewScheduleSetModal: () => null,
}));

vi.mock("@/components/modal/InterviewScheduleViewModal", () => ({
  InterviewScheduleViewModal: () => null,
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const renderPage = async () => {
  const { default: SubmissionDetailPage } = await import("../page");

  render(
    <SubmissionDetailPage params={Promise.resolve({ submissionId: "308" })} />,
  );
};

describe("SubmissionDetailPage interview schedule permissions", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation((...args) => {
        const [message] = args;

        if (
          typeof message === "string" &&
          message.includes("not wrapped in act")
        ) {
          return;
        }
      });
    submissionPageMocks.routerBack.mockReset();
    submissionPageMocks.useUserStore.mockImplementation((selector) =>
      selector({
        userInfo: {
          role: "CLUB_MEMBER",
        },
      }),
    );
    submissionPageMocks.getSubmissionDetail.mockResolvedValue({
      answers: [
        {
          content: "안녕하세요",
          questionContent: "자기소개",
          questionId: 1,
        },
      ],
      applicantId: 141,
      classNumber: "2101",
      clubApplicationStatus: "SUBMITTED",
      hasInterviewSchedule: false,
      introduction: "지원자 소개",
      isInterviewCompleted: false,
      major: "BACKEND",
      phoneNumber: "01012345678",
      userName: "홍길동",
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("allows club members to edit interview schedules", () => {
    expect(canEditInterviewScheduleForRole("CLUB_MEMBER")).toBe(true);
  });

  it("keeps interview schedule edit permission for club leaders", () => {
    expect(canEditInterviewScheduleForRole("CLUB_LEADER")).toBe(true);
  });

  it("does not allow non-club roles to edit interview schedules", () => {
    expect(canEditInterviewScheduleForRole("STUDENT")).toBe(false);
    expect(canEditInterviewScheduleForRole("ADMIN")).toBe(false);
    expect(canEditInterviewScheduleForRole("TEACHER")).toBe(false);
    expect(canEditInterviewScheduleForRole(undefined)).toBe(false);
  });

  it("renders the applicant phone number in the personal information section", async () => {
    await renderPage();

    expect(await screen.findByText("전화번호")).toBeVisible();
    expect(screen.getByText("010-1234-5678")).toBeVisible();
  });
});
