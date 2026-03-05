export interface LoginRequest {
  accountId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  classNumber: string;
  userName: string;
  role:
    | "ADMIN"
    | "STUDENT"
    | "CLUB_MEMBER"
    | "CLUB_LEADER"
    | "TEACHER"
    | "MASTER";
}
