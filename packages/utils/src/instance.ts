import axios from "axios";
import { BASE_URL } from "./env";
import { ApiError, type ApiErrorResponse } from "./types/error";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        const refreshToken = sessionStorage.getItem("refresh_token");

        if (!refreshToken) {
          sessionStorage.removeItem("access_token");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
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
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        sessionStorage.setItem("access_token", newAccessToken);
        if (newRefreshToken) {
          sessionStorage.setItem("refresh_token", newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(createApiError(refreshError));
      }
    }

    return Promise.reject(createApiError(error));
  },
);
