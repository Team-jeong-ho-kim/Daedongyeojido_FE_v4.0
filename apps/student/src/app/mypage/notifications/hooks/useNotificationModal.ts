import { useState } from "react";
import type { AlarmCategory } from "@/types";
import {
  type ActionType,
  type ConfirmModalState,
  INITIAL_MODAL_STATE,
  MODAL_CONTENT_MAP,
} from "../constants/notifications";

export const useNotificationModal = () => {
  const [confirmModal, setConfirmModal] =
    useState<ConfirmModalState>(INITIAL_MODAL_STATE);

  const openModal = (
    type: ActionType,
    alarmId: number,
    category: AlarmCategory,
  ) => {
    setConfirmModal({ isOpen: true, type, alarmId, category });
  };

  const closeModal = () => {
    setConfirmModal(INITIAL_MODAL_STATE);
  };

  const getModalContent = () => {
    const { type, category } = confirmModal;
    const isAccept = type === "accept";
    const content = MODAL_CONTENT_MAP[category || "COMMON"];

    return {
      title: isAccept ? content.acceptTitle : content.rejectTitle,
      description: "이 작업은 되돌릴 수 없습니다.",
      confirmText: isAccept ? content.acceptText : "거절",
      cancelText: "닫기",
    };
  };

  return {
    confirmModal,
    openModal,
    closeModal,
    getModalContent,
  };
};
