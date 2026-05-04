export const ONE_PAGER_FILE_STATUS_OPTIONS = [
  "제출됨",
  "승인됨",
  "반려됨",
  "거절됨",
  "취소됨",
] as const;

export type OnePagerFileStatus = (typeof ONE_PAGER_FILE_STATUS_OPTIONS)[number];

export const DEFAULT_ONE_PAGER_FILE_STATUS: OnePagerFileStatus = "제출됨";

export const isOnePagerFileStatus = (
  value: string,
): value is OnePagerFileStatus =>
  ONE_PAGER_FILE_STATUS_OPTIONS.includes(value as OnePagerFileStatus);
