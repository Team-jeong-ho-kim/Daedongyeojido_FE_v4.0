export type Role = "ADMIN" | "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER" | string;

export interface AdminUserInfo {
  userName: string;
  role: Role;
}

export interface ClubSummary {
  clubId: number;
  clubName: string;
  clubImage: string;
  introduction: string;
  majors: string[];
}

export interface ClubsResponse {
  clubs: ClubSummary[];
}

export interface ClubDetail {
  clubName: string;
  introduction: string;
  oneLiner: string;
  clubImage: string;
  majors: string[];
  links: string[];
}

export interface ClubMember {
  userId: number;
  userName: string;
  majors: string[];
  introduction: string;
  profileImage: string;
}

export interface ClubDetailResponse {
  club: ClubDetail;
  clubMembers: ClubMember[];
}

export interface AdminAlarm {
  id: number;
  title: string;
  content: string;
  category: "COMMON" | "CLUB_MEMBER_APPLY" | "CLUB_ACCEPTED";
  clubId?: number;
  referenceId?: number;
  isExecuted?: boolean;
}

export interface AdminAlarmsResponse {
  alarms: AdminAlarm[];
}

export interface AdminAnnouncementListItem {
  announcementId: number;
  title: string;
  clubName: string;
  deadline: [number, number, number] | string;
  clubImage: string;
  status?: "OPEN" | "CLOSED";
  applicationFormId?: number | null;
}

export interface AdminAnnouncementListResponse {
  announcements: AdminAnnouncementListItem[];
}

export interface AdminAnnouncementDetail {
  clubId: number;
  title: string;
  major: string[];
  phoneNumber: string;
  deadline: string | [number, number, number];
  introduction: string;
  talentDescription: string;
  assignment: string;
  status?: "OPEN" | "CLOSED";
  applicationFormId?: number | null;
}

export interface AdminClubAnnouncement {
  announcementId: number;
  title: string;
  deadline: [number, number, number] | string;
  status: "OPEN" | "CLOSED";
  applicationFormId?: number | null;
}

export interface AdminClubAnnouncementResponse {
  clubAnnouncements: AdminClubAnnouncement[];
}

export interface AdminClubCreationApplication {
  clubId: number;
  clubName: string;
  clubImage: string;
  introduction: string;
  majors: string[];
}

export interface AdminClubCreationApplicationsResponse {
  clubs: AdminClubCreationApplication[];
}

export interface ResultDurationResponse {
  resultDuration: string;
  resultDurationId?: number;
}
