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
  title: string;
  major: Major[];
  phoneNumber: string;
  deadline: string;
  introduction: string;
  talent_description: string;
  assignment: string;
}
