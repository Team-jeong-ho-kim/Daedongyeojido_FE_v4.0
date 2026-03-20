export interface Teacher {
  teacherId: number;
  teacherName: string;
  matched: boolean;
}

export interface TeachersResponse {
  teachers: Teacher[];
}
