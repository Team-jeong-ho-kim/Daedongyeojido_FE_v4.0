export interface TeacherMyInfoResponse {
  accountId: string;
  teacherName: string;
  clubId: number | null;
  clubName: string | null;
}

export interface TeacherClubCreationDetail {
  clubName: string;
  introduction: string;
  oneLiner: string;
  clubImage: string;
  majors: string[];
  links: string[];
}

export interface TeacherClubCreationApplicationDetailResponse {
  club: TeacherClubCreationDetail;
  userName: string;
  classNumber: string;
  clubCreationForm: string;
}
