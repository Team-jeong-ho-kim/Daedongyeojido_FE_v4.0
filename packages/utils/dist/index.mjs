// src/instance.ts
import axios from "axios";

// src/env.ts
var BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
var USER_DOMAIN = process.env.NEXT_PUBLIC_USER_URL;
var NEXT_PUBLIC_ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

// src/types/error.ts
var ApiError = class extends Error {
  constructor(description, status, timestamp, originalMessage) {
    super(description);
    this.description = description;
    this.status = status;
    this.timestamp = timestamp;
    this.originalMessage = originalMessage;
    this.name = "ApiError";
  }
};

// src/instance.ts
var apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
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
  }
);
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const createApiError = (err) => {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data;
        if (errorData.description && errorData.status && errorData.timestamp) {
          return new ApiError(
            errorData.description,
            errorData.status,
            errorData.timestamp,
            errorData.message || ""
          );
        }
      }
      return err;
    };
    if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/signup") || originalRequest.url?.includes("/auth/reissue")) {
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
              "X-Refresh-Token": refreshToken
            }
          }
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
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
  }
);

// src/user/getUserInfo.ts
var getUserInfo = () => {
  if (typeof window === "undefined")
    return { classNumber: null, userName: null };
  const classNumber = localStorage.getItem("class_number");
  const userName = localStorage.getItem("user_name");
  return { classNumber, userName };
};
export {
  ApiError,
  apiClient,
  getUserInfo
};
