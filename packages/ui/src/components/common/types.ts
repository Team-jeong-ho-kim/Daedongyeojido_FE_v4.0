export interface OnePagerCommentItem {
  id: string;
  author: string;
  content: string;
  profileImage?: string | null;
  type?: "GENERAL" | "REJECTION_REASON";
}
