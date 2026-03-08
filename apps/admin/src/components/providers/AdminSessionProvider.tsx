"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { clearTokens, getAccessToken, getSessionUser } from "utils";
import { moveToWebLogin } from "@/lib";
import { useAdminSessionStore } from "@/stores";

export function AdminSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const initializeSession = useAdminSessionStore(
    (state) => state.initializeSession,
  );
  const clearSession = useAdminSessionStore((state) => state.clearSession);

  useEffect(() => {
    const verifySession = () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser || sessionUser.role !== "ADMIN") {
        clearTokens();
        clearSession();
        moveToWebLogin();
        return;
      }

      initializeSession({
        userName: sessionUser.userName,
        role: sessionUser.role,
      });
    };

    const handleFocus = () => {
      verifySession();
    };

    verifySession();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [clearSession, initializeSession, pathname]);

  return children;
}
