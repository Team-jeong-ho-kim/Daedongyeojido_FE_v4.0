import type { OnePagerCommentItem, OnePagerFileStatus } from "ui";

export interface TeacherOnePagerSubmission {
  id: string;
  clubName: string;
  sourceType: "file" | "url";
  source: string;
  sourceName: string;
  submittedAt: string;
  status: OnePagerFileStatus | null;
  comments: OnePagerCommentItem[];
}
