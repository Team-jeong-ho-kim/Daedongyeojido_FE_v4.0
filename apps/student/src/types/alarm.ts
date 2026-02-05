export interface ClubAlarm {
  id: number;
  title: string;
  content: string;
}

export interface ClubAlarmsResponse {
  alarms: ClubAlarm[];
}
