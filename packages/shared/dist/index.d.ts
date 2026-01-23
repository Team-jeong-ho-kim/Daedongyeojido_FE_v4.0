import * as zustand from 'zustand';

type UserRole = "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER";
interface UserInfo {
    userName: string;
    classNumber: string;
    introduction: string | null;
    clubName: string | null;
    major: string[];
    link: string[];
    profileImage: string | null;
    role: UserRole;
}

interface UserStore {
    userInfo: UserInfo | null;
    setUserInfo: (info: UserInfo | null) => void;
    updateRole: (role: UserRole) => void;
    clearUser: () => void;
    isStudent: () => boolean;
    isClubMember: () => boolean;
    isClubLeader: () => boolean;
}
declare const useUserStore: zustand.UseBoundStore<zustand.StoreApi<UserStore>>;

export { type UserInfo, type UserRole, useUserStore };
