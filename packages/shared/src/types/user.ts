// 사용자 권한
export type UserRole = "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER" | "TEACHER";

// 사용자 정보
export interface UserInfo {
  userName: string;
  classNumber: string;
  phoneNumber?: string | null;
  introduction: string | null;
  clubName: string | null;
  major: string[];
  link: string[];
  profileImage: string | null;
  role: UserRole;
}
