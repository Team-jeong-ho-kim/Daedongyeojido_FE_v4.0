export interface LoginRequest {
  accountId: string;
  password: string;
}

export type Role = "ADMIN" | "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  classNumber: string;
  userName: string;
  role: Role;
}
