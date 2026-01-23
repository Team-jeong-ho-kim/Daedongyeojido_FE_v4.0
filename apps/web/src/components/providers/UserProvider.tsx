"use client";

import { useEffect, useState } from "react";
import { useMyInfo } from "@/hooks/querys/useMyInfoQuery";
import { getAccessToken } from "@/lib/token";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = getAccessToken();
    setToken(accessToken);
  }, []);

  useMyInfo({
    enabled: !!token,
  });

  return <>{children}</>;
}
