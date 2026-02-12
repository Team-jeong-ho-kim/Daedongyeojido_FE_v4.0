import type { LoginResponse } from "utils";

export const saveTokens = (
  { accessToken, refreshToken }: LoginResponse,
  rememberMe = false,
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("access_token", accessToken);

  if (rememberMe) {
    localStorage.setItem("refresh_token", refreshToken);
    sessionStorage.removeItem("refresh_token");
  } else {
    sessionStorage.setItem("refresh_token", refreshToken);
    localStorage.removeItem("refresh_token");
  }
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("refresh_token") ||
    sessionStorage.getItem("refresh_token")
  );
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  sessionStorage.removeItem("refresh_token");
};
