import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "shared";
import { toast } from "sonner";
import { updateMyInfo, updateProfile } from "@/api/user";
import { getErrorMessage } from "@/lib/error";
import type { UpdateMyInfoRequest, UpdateProfileRequest } from "@/types";

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
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "정보 저장에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
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
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "정보 저장에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};
