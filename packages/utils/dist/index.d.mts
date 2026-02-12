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

interface ApiErrorResponse {
    description: string;
    message: string;
    status: number;
    timestamp: string;
}
declare class ApiError extends Error {
    readonly description: string;
    readonly status: number;
    readonly timestamp: string;
    readonly originalMessage: string;
    constructor(description: string, status: number, timestamp: string, originalMessage: string);
}

declare const getUserInfo: () => {
    classNumber: string | null;
    userName: string | null;
};

export { ApiError, type ApiErrorResponse, type LoginRequest, type LoginResponse, apiClient, getUserInfo };
