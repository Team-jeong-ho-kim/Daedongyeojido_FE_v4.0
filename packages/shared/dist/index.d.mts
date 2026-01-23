import * as zustand from 'zustand';

type UserRole = "STUDENTS" | "CLUB_MEMBER" | "CLUB_LEADER";
interface UserInfo {
    account_id: string;
    user_name: string;
    class_number: string;
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
