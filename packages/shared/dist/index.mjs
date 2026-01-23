// src/stores/useUserStore.ts
import { create } from "zustand";
var useUserStore = create((set, get) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  updateRole: (role) => set((state) => ({
    userInfo: state.userInfo ? { ...state.userInfo, role } : null
  })),
  clearUser: () => set({ userInfo: null }),
  isStudent: () => get().userInfo?.role === "STUDENTS",
  isClubMember: () => get().userInfo?.role === "CLUB_MEMBER",
  isClubLeader: () => get().userInfo?.role === "CLUB_LEADER"
}));
export {
  useUserStore
};
