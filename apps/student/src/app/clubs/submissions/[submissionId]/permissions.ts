import type { UserRole } from "shared";

export const canEditInterviewScheduleForRole = (role?: UserRole) =>
  role === "CLUB_MEMBER" || role === "CLUB_LEADER";
