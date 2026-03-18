export type ClubCreationApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED";

export type ClubCreationReviewDecision =
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "REJECTED";

export type ClubCreationReviewerType = "ADMIN" | "TEACHER";

export interface ClubCreationApplicationListItem {
  applicationId: number;
  clubName: string;
  clubImage: string | null;
  introduction: string;
  status: ClubCreationApplicationStatus;
  revision: number;
  majors: string[];
  applicantName: string;
  lastSubmittedAt: string;
}

export interface ClubCreationApplicationListResponse {
  applications: ClubCreationApplicationListItem[];
}

export interface ClubCreationApplicationApplicant {
  userId: number;
  userName: string;
  classNumber: string;
}

export interface ClubCreationApplicationReview {
  reviewId: number;
  reviewerType: ClubCreationReviewerType;
  reviewerName: string;
  revision: number;
  decision: ClubCreationReviewDecision;
  feedback: string | null;
  updatedAt: string;
}

export interface ClubCreationApplicationDetail {
  applicationId: number;
  status: ClubCreationApplicationStatus;
  revision: number;
  clubName: string;
  clubImage: string | null;
  clubCreationForm: string | null;
  oneLiner: string;
  introduction: string;
  majors: string[];
  links: string[];
  applicant: ClubCreationApplicationApplicant;
  submittedAt: string | null;
  lastSubmittedAt: string | null;
  currentReviews: ClubCreationApplicationReview[];
  reviewHistory: ClubCreationApplicationReview[];
}

export interface ClubCreationApplicationReviewRequest {
  decision: ClubCreationReviewDecision;
  feedback?: string;
}
