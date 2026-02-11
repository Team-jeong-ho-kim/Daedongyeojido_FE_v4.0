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
    introduction?: string;
    major?: string;
    link?: string;
    profileImage?: string;
}

declare const getUserInfo: () => {
    classNumber: string | null;
    userName: string | null;
};

export { type LoginRequest, type LoginResponse, apiClient, getUserInfo };
