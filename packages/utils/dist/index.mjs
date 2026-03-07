// src/auth-cookie.ts
import { Cookies } from "react-cookie";
var ACCESS_TOKEN_KEY = "access_token";
var REFRESH_TOKEN_KEY = "refresh_token";
var AUTH_ROLE_KEY = "auth_role";
var AUTH_USER_NAME_KEY = "auth_user_name";
var cookies = new Cookies();
var isBrowser = () => typeof window !== "undefined";
var resolveCookieDomain = () => {
  if (!isBrowser()) return null;
  const host = window.location.hostname;
  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  if (isLocalHost) return null;
  if (host.endsWith(".localhost")) return ".localhost";
  const segments = host.split(".").filter(Boolean);
  if (segments.length <= 1) return null;
  if (segments.length === 2) {
    return `.${segments.join(".")}`;
  }
  return `.${segments.slice(-2).join(".")}`;
};
var buildCookieOptions = (expiresInDays = 1, withExpires = true) => {
  const baseOptions = { path: "/" };
  if (!isBrowser()) return baseOptions;
  const expires = /* @__PURE__ */ new Date();
  expires.setDate(expires.getDate() + expiresInDays);
  const domain = resolveCookieDomain();
  const isHttps = window.location.protocol === "https:";
  return {
    ...baseOptions,
    domain: domain || void 0,
    expires: withExpires ? expires : void 0,
    sameSite: isHttps ? "none" : "lax",
    secure: isHttps
  };
};
var setCookie = (key, value, expiresInDays = 1) => {
  if (!isBrowser()) return;
  cookies.set(key, value, buildCookieOptions(expiresInDays));
};
var getCookie = (key) => {
  if (!isBrowser()) return null;
  const value = cookies.get(key);
  return value ?? null;
};
var removeCookie = (key) => {
  if (!isBrowser()) return;
  cookies.remove(key, buildCookieOptions(1, false));
  cookies.remove(key, { path: "/" });
};
var saveTokens = ({
  accessToken,
  refreshToken
}) => {
  setCookie(ACCESS_TOKEN_KEY, accessToken);
  setCookie(REFRESH_TOKEN_KEY, refreshToken, 30);
};
var saveSessionUser = ({ role, userName }) => {
  setCookie(AUTH_ROLE_KEY, role, 1);
  setCookie(AUTH_USER_NAME_KEY, userName, 1);
};
var getAccessToken = () => getCookie(ACCESS_TOKEN_KEY);
var getRefreshToken = () => getCookie(REFRESH_TOKEN_KEY);
var getSessionUser = () => {
  const role = getCookie(AUTH_ROLE_KEY);
  const userName = getCookie(AUTH_USER_NAME_KEY);
  if (!role || !userName) return null;
  return {
    role,
    userName
  };
};
var clearSessionUser = () => {
  removeCookie(AUTH_ROLE_KEY);
  removeCookie(AUTH_USER_NAME_KEY);
};
var clearTokens = () => {
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
  clearSessionUser();
};

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
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
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
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          if (typeof window !== "undefined") {
            const webUrl = process.env.NEXT_PUBLIC_WEB_URL || window.location.origin;
            window.location.href = `${webUrl.replace(/\/$/, "")}/login`;
          }
          return Promise.reject(createApiError(error));
        }
        const response = await axios.patch(
          `${BASE_URL}/auth/reissue`,
          {},
          {
            headers: {
              "X-Refresh-Token": refreshToken
            },
            withCredentials: true
          }
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        saveTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken
        });
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        if (typeof window !== "undefined") {
          const webUrl = process.env.NEXT_PUBLIC_WEB_URL || window.location.origin;
          window.location.href = `${webUrl.replace(/\/$/, "")}/login`;
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
  clearSessionUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getSessionUser,
  getUserInfo,
  saveSessionUser,
  saveTokens
};
