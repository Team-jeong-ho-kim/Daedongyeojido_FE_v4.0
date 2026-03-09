"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "utils";

const normalizeUrl = (value: string) => value.trim().replace(/\/$/, "");

const moveToWebLogin = () => {
  const envWebUrl = process.env.NEXT_PUBLIC_WEB_URL;
  const webUrl = envWebUrl?.trim()
    ? normalizeUrl(envWebUrl)
    : window.location.hostname.endsWith(".daedongyeojido.site")
      ? `${window.location.protocol}//dsm.daedongyeojido.site`
      : "http://localhost:3000";

  window.location.href = `${webUrl}/login`;
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      moveToWebLogin();
    } else {
      setIsAuthorized(true);
    }
  }, []);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
