import { Cookies } from "react-cookie";
import type { LoginResponse } from "./types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_ROLE_KEY = "auth_role";
const AUTH_USER_NAME_KEY = "auth_user_name";
const cookies = new Cookies();

type AuthSessionUser = {
  role: LoginResponse["role"];
  userName: string;
};

type CookieOptions = {
  domain?: string;
  expires?: Date;
  path: string;
  sameSite?: "lax" | "none" | "strict";
  secure?: boolean;
};

const isBrowser = () => typeof window !== "undefined";

const resolveCookieDomain = () => {
  if (!isBrowser()) return null;

  const configuredDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
  if (configuredDomain) return configuredDomain;

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

const buildCookieOptions = (
  expiresInDays = 1,
  withExpires = true,
): CookieOptions => {
  const baseOptions: CookieOptions = { path: "/" };
  if (!isBrowser()) return baseOptions;

  const expires = new Date();
  expires.setDate(expires.getDate() + expiresInDays);

  const domain = resolveCookieDomain();
  const isHttps = window.location.protocol === "https:";
  return {
    ...baseOptions,
    domain: domain || undefined,
    expires: withExpires ? expires : undefined,
    sameSite: isHttps ? "none" : "lax",
    secure: isHttps,
  };
};

const setCookie = (key: string, value: string, expiresInDays = 1) => {
  if (!isBrowser()) return;
  cookies.set(key, value, buildCookieOptions(expiresInDays));
};

const getCookie = (key: string) => {
  if (!isBrowser()) return null;
  const value = cookies.get<string>(key);
  return value ?? null;
};

const removeCookie = (key: string) => {
  if (!isBrowser()) return;
  cookies.remove(key, buildCookieOptions(1, false));
  cookies.remove(key, { path: "/" });
};

export const saveTokens = ({
  accessToken,
  refreshToken,
}: Pick<LoginResponse, "accessToken" | "refreshToken">) => {
  setCookie(ACCESS_TOKEN_KEY, accessToken);
  setCookie(REFRESH_TOKEN_KEY, refreshToken, 30);
};

export const saveSessionUser = ({ role, userName }: LoginResponse) => {
  setCookie(AUTH_ROLE_KEY, role, 1);
  setCookie(AUTH_USER_NAME_KEY, userName, 1);
};

export const getAccessToken = () => getCookie(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => getCookie(REFRESH_TOKEN_KEY);

export const getSessionUser = (): AuthSessionUser | null => {
  const role = getCookie(AUTH_ROLE_KEY);
  const userName = getCookie(AUTH_USER_NAME_KEY);

  if (!role || !userName) return null;
  return {
    role: role as LoginResponse["role"],
    userName,
  };
};

export const clearSessionUser = () => {
  removeCookie(AUTH_ROLE_KEY);
  removeCookie(AUTH_USER_NAME_KEY);
};

export const clearTokens = () => {
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
  clearSessionUser();
};
