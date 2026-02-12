import type { LoginResponse } from "utils";

export const saveTokens = ({ accessToken, refreshToken }: LoginResponse) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("access_token", accessToken);
  sessionStorage.setItem("refresh_token", refreshToken);
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("refresh_token");
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
};
