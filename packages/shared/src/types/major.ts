export type Major =
  | "FE"
  | "BE"
  | "IOS"
  | "ANDROID"
  | "FLUTTER"
  | "DEVOPS"
  | "GAME"
  | "SECURITY"
  | "AI"
  | "DESIGN"
  | "EMBEDDED"
  | "ETC";

export const MAJORS: Major[] = [
  "FE",
  "BE",
  "IOS",
  "ANDROID",
  "FLUTTER",
  "DEVOPS",
  "GAME",
  "SECURITY",
  "AI",
  "DESIGN",
  "EMBEDDED",
  "ETC",
];

export const MAJOR_LABELS: Record<Major, string> = {
  FE: "FE",
  BE: "BE",
  IOS: "IOS",
  ANDROID: "ANDROID",
  FLUTTER: "FLUTTER",
  DEVOPS: "DEVOPS",
  GAME: "GAME",
  SECURITY: "SECURITY",
  AI: "AI",
  DESIGN: "DESIGN",
  EMBEDDED: "EMBEDDED",
  ETC: "기타",
};

export const getMajorLabel = (major: string) =>
  MAJOR_LABELS[major as Major] ?? major;

export const formatMajorList = (majors: string[]) =>
  majors.map(getMajorLabel).join(", ");
