import { useAdminSessionStore } from "@/stores";

export const useAdminAuth = () => {
  const isAuthorized = useAdminSessionStore((state) => state.isAuthorized);
  const isBooting = useAdminSessionStore((state) => state.isBooting);
  const userInfo = useAdminSessionStore((state) => state.userInfo);

  return {
    isAuthorized,
    isBooting,
    userInfo,
  };
};
