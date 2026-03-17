const normalizeUrl = (value: string) => value.trim().replace(/\/+$/, "");

const resolveWebLoginUrl = () => {
  const envWebUrl = process.env.NEXT_PUBLIC_WEB_URL?.trim();

  if (!envWebUrl) {
    return null;
  }

  const webUrl = normalizeUrl(envWebUrl);

  try {
    new URL(webUrl);
  } catch {
    return null;
  }

  return `${webUrl}/login`;
};

export const moveToWebLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  const loginUrl = resolveWebLoginUrl();

  if (!loginUrl) {
    return;
  }

  window.location.href = loginUrl;
};
