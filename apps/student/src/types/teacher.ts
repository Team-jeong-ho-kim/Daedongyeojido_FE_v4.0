export interface Teacher {
  teacherId: number;
  teacherName: string;
}

export interface TeachersResponse {
  teachers: Teacher[];
}
