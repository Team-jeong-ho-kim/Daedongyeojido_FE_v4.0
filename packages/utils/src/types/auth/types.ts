export interface LoginRequest {
  accountId: string;
  password: string;
  division: "STUDENT" | "TEACHER";
}

export type Role =
  | "ADMIN"
  | "STUDENT"
  | "CLUB_MEMBER"
  | "CLUB_LEADER"
  | "TEACHER";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  classNumber: string;
  userName: string;
  role: Role;
}
