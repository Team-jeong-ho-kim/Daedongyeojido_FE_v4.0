import { toast } from "sonner";
import {
  useAcceptMemberRequestMutation,
  useRejectMemberRequestMutation,
  useSelectClubSubmissionMutation,
} from "@/hooks/mutations/useAlarm";
import type { Alarm } from "@/types";
import type { ConfirmModalState } from "../constants/notifications";

type UseNotificationActionsProps = {
  alarms: Alarm[];
  closeModal: () => void;
};

export const useNotificationActions = ({
  alarms,
  closeModal,
}: UseNotificationActionsProps) => {
  const { mutate: acceptMemberRequest } = useAcceptMemberRequestMutation();
  const { mutate: rejectMemberRequest } = useRejectMemberRequestMutation();
  const { mutate: selectClubSubmission } = useSelectClubSubmissionMutation();

  const handleConfirm = (confirmModal: ConfirmModalState) => {
    const { alarmId, category, type } = confirmModal;

    if (!alarmId || !category) return;

    if (!alarms.find((a) => a.id === alarmId)) {
      toast.error("알림 정보를 찾을 수 없습니다.");
      return;
    }

    const isAccept = type === "accept";

    if (category === "CLUB_ACCEPTED") {
      selectClubSubmission({ isSelected: isAccept, alarmId });
    } else if (category === "CLUB_MEMBER_APPLY") {
      (isAccept ? acceptMemberRequest : rejectMemberRequest)(alarmId);
    }

    closeModal();
  };

  return { handleConfirm };
};
