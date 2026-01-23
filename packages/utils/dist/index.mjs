// src/instance.ts
import axios from "axios";

// src/env.ts
var BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
var USER_DOMAIN = process.env.NEXT_PUBLIC_USER_URL;
var NEXT_PUBLIC_ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

// src/instance.ts
var apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
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
    if (originalRequest.url?.includes("/auth/reissue")) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          localStorage.removeItem("access_token");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
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
        localStorage.setItem("access_token", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
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
  apiClient,
  getUserInfo
};
