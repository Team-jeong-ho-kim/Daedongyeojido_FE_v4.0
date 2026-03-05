export type AdminRole =
  | "ADMIN"
  | "STUDENT"
  | "CLUB_MEMBER"
  | "CLUB_LEADER"
  | "TEACHER"
  | "MASTER"
  | string;

export interface AdminUserInfo {
  userName: string;
  classNumber: string;
  introduction: string | null;
  clubName: string | null;
  major: string[];
  link: string[];
  profileImage: string | null;
  role: AdminRole;
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

export interface ApplicationFormListItem {
  applicationFormId: number;
  applicationFormTitle: string;
  clubName: string;
  clubImage?: string;
  submissionDuration?: [number, number, number] | string;
}

export interface ApplicationFormsResponse {
  applicationForms: ApplicationFormListItem[];
}
