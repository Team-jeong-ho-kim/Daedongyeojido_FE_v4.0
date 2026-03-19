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
