import type {
  ClubCreationApplicationDetail,
  ClubCreationApplicationListItem,
  ClubCreationApplicationListResponse,
  ClubCreationApplicationReview,
  ClubCreationApplicationReviewRequest,
  ClubCreationReviewDecision,
  ClubCreationReviewerType,
} from "utils";

export interface TeacherMyInfoResponse {
  accountId: string;
  teacherName: string;
  clubId: number | null;
  clubName: string | null;
}

export type TeacherClubCreationApplication = ClubCreationApplicationListItem;

export type TeacherClubCreationApplicationsResponse =
  ClubCreationApplicationListResponse;

export type TeacherClubCreationApplicationDetailResponse =
  ClubCreationApplicationDetail;

export type TeacherClubCreationReviewRequest =
  ClubCreationApplicationReviewRequest;

export type TeacherClubCreationReview = ClubCreationApplicationReview;

export type TeacherClubCreationDecision = ClubCreationReviewDecision;

export type TeacherClubCreationReviewerType = ClubCreationReviewerType;

export type { ClubCreationReviewDecision, ClubCreationReviewerType };

export interface TeacherClubSummary {
  clubId: number;
  clubName: string;
  clubImage: string;
  introduction: string;
  majors: string[];
}

export interface TeacherClubsResponse {
  clubs: TeacherClubSummary[];
}

export interface TeacherClubDetail {
  clubName: string;
  introduction: string;
  oneLiner: string;
  clubImage: string;
  majors: string[];
  links: string[];
}

export interface TeacherClubMember {
  userId: number;
  userName: string;
  majors: string[];
  introduction: string;
  profileImage: string;
}

export interface TeacherClubDetailResponse {
  club: TeacherClubDetail;
  clubMembers: TeacherClubMember[];
}

export interface TeacherAnnouncementListItem {
  announcementId: number;
  title: string;
  clubName: string;
  deadline: [number, number, number] | string;
  clubImage: string;
  status?: "OPEN" | "CLOSED";
  applicationFormId?: number | null;
}

export interface TeacherAnnouncementListResponse {
  announcements: TeacherAnnouncementListItem[];
}

export interface TeacherAnnouncementDetailResponse {
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

export interface TeacherClubAnnouncement {
  announcementId: number;
  title: string;
  deadline: [number, number, number] | string;
  status: "OPEN" | "CLOSED";
  applicationFormId?: number | null;
}

export interface TeacherClubAnnouncementResponse {
  clubAnnouncements: TeacherClubAnnouncement[];
}

export interface TeacherDocumentFileItem {
  fileId: number;
  fileName: string;
  fileUrl: string;
}

export interface TeacherDocumentFilesResponse {
  fileResponses: TeacherDocumentFileItem[];
}
