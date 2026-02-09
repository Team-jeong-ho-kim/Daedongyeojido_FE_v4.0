// Application Form Types
export interface CreateApplicationFormRequest {
  applicationFormTitle: string;
  content: string[];
  submissionDuration: string;
  majors: string[];
}

export interface ApplicationForm {
  id: number;
  applicationFormTitle: string;
  content: string[];
  submissionDuration: string;
  majors: string[];
  createdAt: string;
  updatedAt: string;
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

export interface ApplicationQuestion {
  applicationQuestionId: number;
  content: string;
}

export interface ApplicationFormDetail {
  applicationFormTitle: string;
  clubName: string;
  clubImage?: string;
  content: ApplicationQuestion[];
  submissionDuration?: [number, number, number] | string;
  major?: string[];
}

// Application Submission Types
export interface SubmitApplicationRequest {
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  answer: {
    applicationQuestionId: number;
    answer: string;
  }[];
}

export interface ApplicationSubmission {
  submissionId: number;
  userName: string;
  classNumber: string;
  major: string[] | string;
  clubApplicationStatus?: "SUBMITTED" | "WRITING" | "ACCEPTED" | "REJECTED";
}

export interface ApplicationSubmissionsResponse {
  applicants: ApplicationSubmission[];
}

export interface SubmissionAnswer {
  questionId: number;
  questionContent: string;
  content: string;
}

export interface SubmissionDetail {
  applicantId: number;
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  answers: SubmissionAnswer[];
  hasInterviewSchedule: boolean;
  clubApplicationStatus?: "SUBMITTED" | "WRITING" | "ACCEPTED" | "REJECTED";
}

// My Application Types
export interface MyApplication {
  submissionId: number;
  clubName: string;
  clubImage?: string;
  user_application_status: "WRITING" | "SUBMITTED";
  submissionDuration: string | [number, number, number];
}

export interface MyApplicationsResponse {
  applications: MyApplication[];
}

export interface MySubmissionHistoryItem {
  submissionId: number;
  clubName: string;
  clubImage?: string;
  user_application_status: string;
  submissionDuration: string | [number, number, number];
}

export interface MySubmissionHistoryResponse {
  submissions: MySubmissionHistoryItem[];
}

export interface MySubmissionAnswer {
  applicationQuestionId: number;
  question: string;
  applicationAnswerId: number;
  answer: string;
}

export interface MySubmissionDetail {
  clubName: string;
  clubImage?: string;
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  contents: MySubmissionAnswer[];
  submissionDuration: string | [number, number, number];
  user_application_status?: "WRITING" | "SUBMITTED" | "ACCEPTED" | "REJECTED";
}

export interface UpdateMySubmissionRequest {
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  answer: {
    applicationQuestionId: number;
    answer: string;
  }[];
}

// Interview Schedule Types
export interface CreateInterviewScheduleRequest {
  interviewSchedule: string;
  place: string;
  interviewTime: string;
}

export interface InterviewScheduleDetail {
  scheduleId: number;
  userName: string;
  classNumber: string;
  major: string;
  place: string;
  interviewTime: string;
  interviewSchedule: string;
}

export interface UpdateInterviewScheduleRequest {
  interviewSchedule: string;
  place: string;
  interviewTime: string;
}

// Pass Decision Types
export interface DecidePassRequest {
  isPassed: boolean;
}

// Result Duration Types
export interface ResultDurationResponse {
  resultDuration: string;
}

// User Alarm Types
export interface Alarm {
  id: number;
  title: string;
  content: string;
  category: "COMMON" | "CLUB_MEMBER_APPLY" | "CLUB_ACCEPTED";
  clubId?: number;
  referenceId?: number;
  isExecuted?: boolean;
}

export interface AlarmsResponse {
  alarms: Alarm[];
}
