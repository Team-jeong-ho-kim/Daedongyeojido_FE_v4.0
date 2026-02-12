export interface LoginRequest {
  accountId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  classNumber: string;
  userName: string;
  introduction: string | null;
  clubName: string | null;
  major: string[];
  link: string[];
  profileImage: string | null;
  role: "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER";
}
