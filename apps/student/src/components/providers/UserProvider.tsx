"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "shared";
import { clearTokens, getAccessToken, getSessionUser } from "utils";
import { useMyInfoQuery } from "@/hooks/querys";
import { isOnboardingRequired } from "@/lib";

const normalizeUrl = (value: string) => value.trim().replace(/\/+$/, "");

const resolveWebLoginUrl = () => {
  if (typeof window === "undefined") {
    return null;
  }

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

const moveToWebLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  const loginUrl = resolveWebLoginUrl();

  if (!loginUrl) {
    return;
  }

  window.location.href = loginUrl;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const accessToken = getAccessToken();
    setHasToken(!!accessToken);
  }, []);

  useEffect(() => {
    const verifySession = () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser) {
        clearTokens();
        useUserStore.getState().clearUser();
        setHasToken(false);
        moveToWebLogin();
        return;
      }

      setHasToken(true);
    };

    const handleFocus = () => {
      verifySession();
    };

    verifySession();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathname]);

  const myInfoQuery = useMyInfoQuery({
    enabled: hasToken,
  });

  useEffect(() => {
    if (!hasToken || !myInfoQuery.data) {
      return;
    }

    const needsOnboarding = isOnboardingRequired(myInfoQuery.data);
    const isOnboardingPage = pathname.startsWith("/onboarding");

    if (needsOnboarding && !isOnboardingPage) {
      router.replace("/onboarding");
      return;
    }

    if (!needsOnboarding && isOnboardingPage) {
      router.replace("/mypage");
    }
  }, [hasToken, myInfoQuery.data, pathname, router]);

  if (hasToken && myInfoQuery.isPending) {
    return null;
  }

  return <>{children}</>;
}
