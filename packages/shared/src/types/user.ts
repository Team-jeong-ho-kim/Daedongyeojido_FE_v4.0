// 사용자 권한 (도메인 모델)
export type UserRole = "STUDENTS" | "CLUB_MEMBER" | "CLUB_LEADER";

// 사용자 정보 (도메인 모델)
export interface UserInfo {
  account_id: string;
  user_name: string;
  class_number: string;
  role: UserRole;
  // API 응답에 따라 필요한 필드 추가
}
