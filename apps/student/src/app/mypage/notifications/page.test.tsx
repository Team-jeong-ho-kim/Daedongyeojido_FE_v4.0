import { fireEvent, render, screen } from "@testing-library/react";
import NotificationsPage from "./page";

const notificationsMocks = vi.hoisted(() => ({
  closeModal: vi.fn(),
  getModalContent: vi.fn(() => ({
    cancelText: "닫기",
    confirmText: "수락",
    description: "이 작업은 되돌릴 수 없습니다.",
    title: "팀원 추가 신청을 수락하시겠습니까?",
  })),
  handleConfirm: vi.fn(),
  openModal: vi.fn(),
  useDeferredLoading: vi.fn(),
  useGetUserAlarmsQuery: vi.fn(),
}));

vi.mock("ui", () => ({
  SkeletonListItem: () => <div>loading skeleton</div>,
  useDeferredLoading: notificationsMocks.useDeferredLoading,
}));

vi.mock("@/hooks/querys/useApplicationFormQuery", () => ({
  useGetUserAlarmsQuery: notificationsMocks.useGetUserAlarmsQuery,
}));

vi.mock("./hooks", () => ({
  useNotificationActions: () => ({
    handleConfirm: notificationsMocks.handleConfirm,
  }),
  useNotificationModal: () => ({
    closeModal: notificationsMocks.closeModal,
    confirmModal: {
      alarmId: null,
      category: null,
      isOpen: false,
      type: "accept",
    },
    getModalContent: notificationsMocks.getModalContent,
    openModal: notificationsMocks.openModal,
  }),
}));

vi.mock("./components", () => ({
  EmptyNotifications: () => <div>empty notifications</div>,
  NotificationItem: ({
    alarm,
    isExpanded,
    onToggle,
  }: {
    alarm: { id: number; title: string };
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <button onClick={onToggle} type="button">
      {alarm.title}-{isExpanded ? "expanded" : "collapsed"}
    </button>
  ),
}));

vi.mock("@/components/modal/ApplicationConfirmModal", () => ({
  ApplicationConfirmModal: () => <div>confirm modal</div>,
}));

vi.mock("@/components/common/Pagination", () => ({
  Pagination: () => <div>pagination</div>,
}));

describe("NotificationsPage", () => {
  beforeEach(() => {
    Object.values(notificationsMocks).forEach((mock) => {
      mock.mockReset();
    });
    notificationsMocks.useDeferredLoading.mockReturnValue(false);
  });

  it("renders empty state when there are no alarms", () => {
    notificationsMocks.useGetUserAlarmsQuery.mockReturnValue({
      data: [],
      isPending: false,
    });

    render(<NotificationsPage />);

    expect(screen.getByText("empty notifications")).toBeVisible();
  });

  it("renders notifications and toggles expansion", () => {
    notificationsMocks.useGetUserAlarmsQuery.mockReturnValue({
      data: [
        {
          category: "CLUB_MEMBER_APPLY",
          content: "",
          id: 3,
          title: "세 번째 알림",
        },
        {
          category: "CLUB_ACCEPTED",
          content: "",
          id: 1,
          title: "첫 번째 알림",
        },
      ],
      isPending: false,
    });

    render(<NotificationsPage />);

    const button = screen.getByRole("button", {
      name: "세 번째 알림-collapsed",
    });
    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: "세 번째 알림-expanded" }),
    ).toBeVisible();
    expect(screen.getByText("confirm modal")).toBeVisible();
  });
});
