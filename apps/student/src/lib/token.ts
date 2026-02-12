import type { LoginResponse } from "utils";

export const saveTokens = ({ accessToken, refreshToken }: LoginResponse) => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem("access_token", accessToken);
  sessionStorage.setItem("refresh_token", refreshToken);
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("refresh_token");
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
};
