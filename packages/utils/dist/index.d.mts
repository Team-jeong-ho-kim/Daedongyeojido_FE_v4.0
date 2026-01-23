import * as axios from 'axios';

declare const apiClient: axios.AxiosInstance;

interface LoginRequest {
    account_id: string;
    password: string;
}
interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    classNumber: string;
    userName: string;
}

declare const getUserInfo: () => {
    classNumber: string | null;
    userName: string | null;
};

export { type LoginRequest, type LoginResponse, apiClient, getUserInfo };
