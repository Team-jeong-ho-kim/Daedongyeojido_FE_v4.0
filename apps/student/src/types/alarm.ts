export type AlarmCategory = "COMMON" | "CLUB_MEMBER_APPLY" | "CLUB_ACCEPTED";

export interface ClubAlarm {
  id: number;
  title: string;
  content: string;
  category: AlarmCategory;
  clubId?: number;
  referenceId?: number;
}

export interface ClubAlarmsResponse {
  alarms: ClubAlarm[];
}
