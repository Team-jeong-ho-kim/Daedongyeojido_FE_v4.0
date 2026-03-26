import { renderHook } from "@testing-library/react";

const mutationMocks = vi.hoisted(() => ({
  acceptMemberRequest: vi.fn(),
  rejectMemberRequest: vi.fn(),
  selectClubSubmission: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: mutationMocks.toastError,
  },
}));

vi.mock("@/hooks/mutations/useAlarm", () => ({
  useAcceptMemberRequestMutation: () => ({
    mutate: mutationMocks.acceptMemberRequest,
  }),
  useRejectMemberRequestMutation: () => ({
    mutate: mutationMocks.rejectMemberRequest,
  }),
  useSelectClubSubmissionMutation: () => ({
    mutate: mutationMocks.selectClubSubmission,
  }),
}));

import { useNotificationActions } from "../useNotificationActions";

describe("useNotificationActions", () => {
  beforeEach(() => {
    Object.values(mutationMocks).forEach((mock) => {
      mock.mockReset();
    });
  });

  it("accepts member requests", () => {
    const closeModal = vi.fn();
    const { result } = renderHook(() =>
      useNotificationActions({
        alarms: [
          {
            category: "CLUB_MEMBER_APPLY",
            content: "",
            id: 11,
            title: "팀원 추가 신청",
          },
        ],
        closeModal,
      }),
    );

    result.current.handleConfirm({
      alarmId: 11,
      category: "CLUB_MEMBER_APPLY",
      isOpen: true,
      type: "accept",
    });

    expect(mutationMocks.acceptMemberRequest).toHaveBeenCalledWith(11);
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("rejects club accepted notifications through selectClubSubmission", () => {
    const closeModal = vi.fn();
    const { result } = renderHook(() =>
      useNotificationActions({
        alarms: [
          {
            category: "CLUB_ACCEPTED",
            content: "",
            id: 12,
            title: "합류 제안",
          },
        ],
        closeModal,
      }),
    );

    result.current.handleConfirm({
      alarmId: 12,
      category: "CLUB_ACCEPTED",
      isOpen: true,
      type: "reject",
    });

    expect(mutationMocks.selectClubSubmission).toHaveBeenCalledWith({
      alarmId: 12,
      isSelected: false,
    });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("shows an error when the alarm no longer exists", () => {
    const { result } = renderHook(() =>
      useNotificationActions({
        alarms: [],
        closeModal: vi.fn(),
      }),
    );

    result.current.handleConfirm({
      alarmId: 99,
      category: "CLUB_ACCEPTED",
      isOpen: true,
      type: "accept",
    });

    expect(mutationMocks.toastError).toHaveBeenCalledWith(
      "알림 정보를 찾을 수 없습니다.",
    );
  });
});
