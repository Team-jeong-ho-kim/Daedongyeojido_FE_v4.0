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
