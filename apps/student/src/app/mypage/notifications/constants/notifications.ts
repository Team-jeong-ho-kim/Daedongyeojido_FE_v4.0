import type { AlarmCategory } from "@/types";

export const ITEMS_PER_PAGE = 5;

export type ActionType = "accept" | "reject";

export type ConfirmModalState = {
  isOpen: boolean;
  type: ActionType;
  alarmId: number | null;
  category: AlarmCategory | null;
};

export const INITIAL_MODAL_STATE: ConfirmModalState = {
  isOpen: false,
  type: "accept",
  alarmId: null,
  category: null,
};

export type ModalContent = {
  acceptTitle: string;
  rejectTitle: string;
  acceptText: string;
};

export const MODAL_CONTENT_MAP: Record<AlarmCategory, ModalContent> = {
  CLUB_MEMBER_APPLY: {
    acceptTitle: "팀원 추가 신청을 수락하시겠습니까?",
    rejectTitle: "팀원 추가 신청을 거절하시겠습니까?",
    acceptText: "수락",
  },
  CLUB_ACCEPTED: {
    acceptTitle: "동아리에 합류하시겠습니까?",
    rejectTitle: "동아리 합류를 거절하시겠습니까?",
    acceptText: "합류",
  },
  COMMON: {
    acceptTitle: "",
    rejectTitle: "",
    acceptText: "",
  },
};
