import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { addTeacher } from "@/api/teacher";
import { getErrorMessage } from "@/lib";

interface addTeacherRequestType {
  accountId: string;
  password: string;
  teacherName: string;
}

export const useAddTeacher = () => {
  return useMutation({
    mutationFn: (data: addTeacherRequestType) => addTeacher(data),
    onSuccess: () => {
      toast.success("지도 교사가 추가되었습니다.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "지도 교사 추가가 실패했습니다."));
    },
  });
};
