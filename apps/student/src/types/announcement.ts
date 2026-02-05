import type { Major } from "./major";

export interface Announcement {
  announcement_id: number;
  title: string;
  club_name: string;
  deadline: string;
  club_image?: string;
}

export interface AnnouncementsResponse {
  announcements: Announcement[];
}

export interface AnnouncementDetailResponse {
  clubId: number;
  title: string;
  major: Major[];
  phoneNumber: string;
  deadline: string | [number, number, number];
  introduction: string;
  talentDescription: string;
  assignment: string;
  status?: "OPEN" | "CLOSED";
  applicationFormId?: number | null;
}

export interface AnnouncementCreate {
  title: string;
  introduction: string;
  phoneNumber: string;
  major: string[];
  deadline: string;
  talentDescription: string;
  assignment: string;
}

export interface AnnouncementListItem {
  announcementId: number;
  title: string;
  clubName: string;
  deadline: [number, number, number] | string; // [year, month, day] or string
  clubImage: string;
  status?: "OPEN" | "CLOSED";
  applicationFormId?: number | null;
}

export interface AnnouncementListResponse {
  announcements: AnnouncementListItem[];
}

export interface ClubAnnouncement {
  announcementId: number;
  title: string;
  deadline: [number, number, number] | string;
  status: "OPEN" | "CLOSED";
  applicationFormId?: number | null;
}

export interface ClubAnnouncementResponse {
  clubAnnouncements: ClubAnnouncement[];
}
