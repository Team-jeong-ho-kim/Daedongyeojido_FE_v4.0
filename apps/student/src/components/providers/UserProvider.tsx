"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessToken } from "utils";
import { useMyInfoQuery } from "@/hooks/querys/useMyInfoQuery";
import { isOnboardingRequired } from "@/lib/onboarding";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const accessToken = getAccessToken();
    setHasToken(!!accessToken);
  }, []);

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
