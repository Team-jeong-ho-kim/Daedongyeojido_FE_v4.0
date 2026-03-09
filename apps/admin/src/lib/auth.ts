const normalizeUrl = (value: string) => value.trim().replace(/\/$/, "");

export const moveToWebLogin = () => {
  const envWebUrl = process.env.NEXT_PUBLIC_WEB_URL;
  const webUrl = envWebUrl?.trim()
    ? normalizeUrl(envWebUrl)
    : typeof window !== "undefined" &&
        window.location.hostname.endsWith(".daedongyeojido.site")
      ? `${window.location.protocol}//dsm.daedongyeojido.site`
      : "http://localhost:3000";

  window.location.href = `${webUrl}/login`;
};
