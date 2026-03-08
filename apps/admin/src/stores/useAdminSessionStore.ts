import { create } from "zustand";
import type { AdminUserInfo } from "@/types/admin";

type AdminSessionState = {
  isAuthorized: boolean;
  isBooting: boolean;
  userInfo: AdminUserInfo | null;
  initializeSession: (userInfo: AdminUserInfo) => void;
  clearSession: () => void;
};

export const useAdminSessionStore = create<AdminSessionState>((set) => ({
  isAuthorized: false,
  isBooting: true,
  userInfo: null,
  initializeSession: (userInfo) =>
    set({
      userInfo,
      isAuthorized: true,
      isBooting: false,
    }),
  clearSession: () =>
    set({
      userInfo: null,
      isAuthorized: false,
      isBooting: false,
    }),
}));
