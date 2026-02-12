import * as axios from 'axios';

declare const apiClient: axios.AxiosInstance;

interface LoginRequest {
    accountId: string;
    password: string;
}
interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    classNumber: string;
    userName: string;
    introduction: string | null;
    clubName: string | null;
    major: string[];
    link: string[];
    profileImage: string | null;
    role: "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER";
}

declare const getUserInfo: () => {
    classNumber: string | null;
    userName: string | null;
};

export { type LoginRequest, type LoginResponse, apiClient, getUserInfo };
