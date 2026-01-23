"use client";

import { useEffect, useState } from "react";
import { useMyInfoQuery } from "@/hooks/querys/useMyInfoQuery";
import { getAccessToken } from "@/lib/token";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    setHasToken(!!accessToken);
  }, []);

  useMyInfoQuery({
    enabled: hasToken,
  });

  return <>{children}</>;
}
