export interface OnePagerCommentItem {
  id: string;
  author: string;
  content: string;
  profileImage?: string | null;
  type?: "GENERAL" | "REJECTION_REASON";
}

export type PaginationProps = {
  listLen: number;
  limit: number;
  curPage: number;
  setCurPage: (page: number) => void;
};
