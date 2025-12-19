export interface Announcement {
  announcement_id: number;
  title: string;
  tags: string[];
  meetingTime: string;
  image?: string;
}

export interface AnnouncementsResponse {
  announcements: Announcement[];
}
