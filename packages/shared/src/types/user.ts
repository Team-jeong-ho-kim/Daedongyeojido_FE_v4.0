// 사용자 권한 (도메인 모델)
export type UserRole = "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER";

// 사용자 정보 (도메인 모델)
export interface UserInfo {
  userName: string;
  classNumber: string;
  introduction: string | null;
  clubName: string | null;
  major: string[];
  link: string[];
  profileImage: string | null;
  role: UserRole;
}
