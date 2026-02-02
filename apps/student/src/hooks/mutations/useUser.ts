import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "shared";
import { toast } from "sonner";
import type { UpdateMyInfoRequest, UpdateProfileRequest } from "@/api/user";
import { updateMyInfo, updateProfile } from "@/api/user";

export const useUpdateMyInfoMutation = () => {
  const queryClient = useQueryClient();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateMyInfoRequest) => updateMyInfo(data),
    onSuccess: (data) => {
      setUserInfo(data);
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      toast.success("정보가 저장되었습니다.");
      setTimeout(() => {
        router.push("/mypage");
      }, 1500);
    },
    onError: (error: any) => {
      console.error("정보 업데이트 실패:", error);
      const status = error.response?.status;

      if (status === 400) {
        toast.error("입력 정보를 확인해주세요.");
      } else if (status === 401) {
        toast.error("로그인이 필요합니다.");
      } else {
        toast.error("정보 저장에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (data) => {
      setUserInfo(data);
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      toast.success("정보가 저장되었습니다.");
      setTimeout(() => {
        router.push("/mypage");
      }, 1500);
    },
    onError: (error: any) => {
      console.error("프로필 업데이트 실패:", error);
      const status = error.response?.status;

      if (status === 400) {
        toast.error("입력 정보를 확인해주세요.");
      } else if (status === 401) {
        toast.error("로그인이 필요합니다.");
      } else {
        toast.error("정보 저장에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};
