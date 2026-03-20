import { ApiError } from "utils";

export type LoginService = "web" | "student" | "admin" | "teacher";

const normalizeUrl = (value: string) => value.trim().replace(/\/$/, "");

export const toLoginErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    return error.description;
  }

  return fallback;
};

export const resolveServiceUrl = (
  envUrl: string | undefined,
  service: LoginService,
) => {
  if (envUrl?.trim()) {
    return normalizeUrl(envUrl);
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;

    if (hostname.endsWith(".daedongyeojido.site")) {
      const serviceHost =
        service === "web"
          ? "dsm.daedongyeojido.site"
          : `${service}.daedongyeojido.site`;

      return `${protocol}//${serviceHost}`;
    }
  }

  const localFallbackMap = {
    web: "http://localhost:3000",
    student: "http://localhost:3001",
    admin: "http://localhost:3002",
    teacher: "http://localhost:3003",
  } satisfies Record<LoginService, string>;

  return localFallbackMap[service];
};
