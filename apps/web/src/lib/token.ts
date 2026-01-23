import type { LoginResponse } from "utils";

export const saveTokens = ({
  accessToken,
  refreshToken,
  classNumber,
  userName,
}: LoginResponse) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  localStorage.setItem("class_number", classNumber);
  localStorage.setItem("user_name", userName);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("class_number");
  localStorage.removeItem("user_name");
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const getUserInfo = (): {
  classNumber: string | null;
  userName: string | null;
} => {
  if (typeof window === "undefined")
    return { classNumber: null, userName: null };
  const classNumber = localStorage.getItem("class_number");
  const userName = localStorage.getItem("user_name");

  return { classNumber, userName };
};
