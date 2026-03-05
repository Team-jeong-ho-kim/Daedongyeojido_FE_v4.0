"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "utils";

const moveToWebLogin = () => {
  const webUrl = (process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");
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
