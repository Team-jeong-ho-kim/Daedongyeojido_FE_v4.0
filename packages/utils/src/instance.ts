import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./auth-cookie";
import { BASE_URL } from "./env";
import { ApiError, type ApiErrorResponse } from "./types/error";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 서버 에러 응답을 ApiError로 변환하는 헬퍼 함수
    const createApiError = (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as ApiErrorResponse;
        if (errorData.description && errorData.status && errorData.timestamp) {
          return new ApiError(
            errorData.description,
            errorData.status,
            errorData.timestamp,
            errorData.message || "",
          );
        }
      }
      return err;
    };

    // 로그인, 회원가입, 토큰 재발급 요청은 401 인터셉터를 건너뜀
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/reissue")
    ) {
      return Promise.reject(createApiError(error));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          clearTokens();
          if (typeof window !== "undefined") {
            const webUrl =
              process.env.NEXT_PUBLIC_WEB_URL || window.location.origin;
            window.location.href = `${webUrl.replace(/\/$/, "")}/login`;
          }
          return Promise.reject(createApiError(error));
        }

        const response = await axios.patch(
          `${BASE_URL}/auth/reissue`,
          {},
          {
            headers: {
              "X-Refresh-Token": refreshToken,
            },
            withCredentials: true,
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        saveTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken,
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        if (typeof window !== "undefined") {
          const webUrl =
            process.env.NEXT_PUBLIC_WEB_URL || window.location.origin;
          window.location.href = `${webUrl.replace(/\/$/, "")}/login`;
        }
        return Promise.reject(createApiError(refreshError));
      }
    }

    return Promise.reject(createApiError(error));
  },
);
