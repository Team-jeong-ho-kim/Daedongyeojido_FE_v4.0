const normalizeEnv = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeBaseUrl = (value: string | undefined) => {
  const trimmed = normalizeEnv(value);
  return trimmed ? trimmed.replace(/\/+$/, "") : undefined;
};

export const BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
export const USER_DOMAIN = normalizeEnv(process.env.NEXT_PUBLIC_USER_URL);
export const NEXT_PUBLIC_ADMIN_URL = normalizeEnv(
  process.env.NEXT_PUBLIC_ADMIN_URL,
);
export const NEXT_PUBLIC_TEACHER_URL = normalizeEnv(
  process.env.NEXT_PUBLIC_TEACHER_URL,
);
