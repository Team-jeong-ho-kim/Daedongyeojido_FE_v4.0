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
    role: "ADMIN" | "STUDENTS" | "STUDENT" | "CLUB_MEMBER" | "CLUB_LEADER" | "TEACHER" | "MASTER";
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

type AuthSessionUser = {
    role: LoginResponse["role"];
    userName: string;
};
declare const saveTokens: ({ accessToken, refreshToken, }: Pick<LoginResponse, "accessToken" | "refreshToken">) => void;
declare const saveSessionUser: ({ role, userName }: LoginResponse) => void;
declare const getAccessToken: () => string | null;
declare const getRefreshToken: () => string | null;
declare const getSessionUser: () => AuthSessionUser | null;
declare const clearSessionUser: () => void;
declare const clearTokens: () => void;

declare const getUserInfo: () => {
    classNumber: string | null;
    userName: string | null;
};

export { ApiError, type ApiErrorResponse, type LoginRequest, type LoginResponse, apiClient, clearSessionUser, clearTokens, getAccessToken, getRefreshToken, getSessionUser, getUserInfo, saveSessionUser, saveTokens };
