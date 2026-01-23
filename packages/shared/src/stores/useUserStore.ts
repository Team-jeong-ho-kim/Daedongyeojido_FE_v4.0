import { create } from "zustand";
import type { UserInfo, UserRole } from "../types/user";

interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  updateRole: (role: UserRole) => void;
  clearUser: () => void;
  isStudent: () => boolean;
  isClubMember: () => boolean;
  isClubLeader: () => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,

  setUserInfo: (info) => set({ userInfo: info }),

  updateRole: (role) =>
    set((state) => ({
      userInfo: state.userInfo ? { ...state.userInfo, role } : null,
    })),

  clearUser: () => set({ userInfo: null }),

  isStudent: () => get().userInfo?.role === "STUDENT",

  isClubMember: () => get().userInfo?.role === "CLUB_MEMBER",

  isClubLeader: () => get().userInfo?.role === "CLUB_LEADER",
}));
