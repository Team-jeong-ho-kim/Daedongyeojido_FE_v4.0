import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useNotificationModal } from "../useNotificationModal";

describe("useNotificationModal", () => {
  it("opens and closes the modal with category-specific copy", () => {
    const { result } = renderHook(() => useNotificationModal());

    act(() => {
      result.current.openModal("accept", 10, "CLUB_MEMBER_APPLY");
    });

    expect(result.current.confirmModal).toEqual({
      alarmId: 10,
      category: "CLUB_MEMBER_APPLY",
      isOpen: true,
      type: "accept",
    });
    expect(result.current.getModalContent()).toEqual({
      cancelText: "닫기",
      confirmText: "수락",
      description: "이 작업은 되돌릴 수 없습니다.",
      title: "팀원 추가 신청을 수락하시겠습니까?",
    });

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.confirmModal.isOpen).toBe(false);
  });
});
