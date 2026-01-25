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

export interface ApplicationQuestion {
  application_question_id: number;
  content: string;
}

export interface ApplicationFormResponse {
  application_form_title: string;
  club_name: string;
  club_image: string;
  content: ApplicationQuestion[];
  submission_duration: string;
  major: string[];
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
