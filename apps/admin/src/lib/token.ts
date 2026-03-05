import type { LoginResponse } from "utils";

const ADMIN_SESSION_USER_KEY = "admin_session_user";

export type AdminSessionUser = {
  userName: string;
  role: LoginResponse["role"];
};

export const saveTokens = ({ accessToken, refreshToken }: LoginResponse) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("access_token", accessToken);
  sessionStorage.setItem("refresh_token", refreshToken);
};

export const saveAdminSessionUser = ({ userName, role }: LoginResponse) => {
  if (typeof window === "undefined") return;
  const value: AdminSessionUser = { userName, role };
  sessionStorage.setItem(ADMIN_SESSION_USER_KEY, JSON.stringify(value));
};

export const getAdminSessionUser = (): AdminSessionUser | null => {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(ADMIN_SESSION_USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as AdminSessionUser;
  } catch {
    sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
    return null;
  }
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("access_token");
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
};
