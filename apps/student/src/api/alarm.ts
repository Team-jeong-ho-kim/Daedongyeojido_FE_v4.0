import { apiClient } from "utils";
import type { ClubAlarmsResponse } from "@/types";

export const getClubAlarms = async () => {
  const response = await apiClient.get<ClubAlarmsResponse>("/alarms/clubs");
  return response.data.alarms;
};

// 팀원 추가 신청 수락/거절 (CLUB_MEMBER_APPLY)
export const acceptMemberRequest = async (alarmId: number) => {
  const response = await apiClient.patch("/users/members", {
    isApproved: true,
    alarmId: alarmId,
  });
  return response.data;
};

export const rejectMemberRequest = async (alarmId: number) => {
  const response = await apiClient.patch("/users/members", {
    isApproved: false,
    alarmId: alarmId,
  });
  return response.data;
};

// 동아리 합격 후 합류/거절 결정 (CLUB_ACCEPTED)
export const selectClubSubmission = async (
  isSelected: boolean,
  alarmId: number,
) => {
  const response = await apiClient.patch("/users/submissions", {
    isSelected: isSelected,
    alarmId: alarmId,
  });
  return response.data;
};

// 동아리 알림 삭제 (동아리 리더, 멤버만 가능)
export const deleteClubAlarm = async (alarmId: number) => {
  await apiClient.delete(`/clubs/alarms/${alarmId}`);
};
