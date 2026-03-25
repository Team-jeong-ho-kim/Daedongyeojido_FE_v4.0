"use client";

import { useEffect, useState } from "react";
import { type UserRole, useUserStore } from "shared";
import { getSessionUser } from "utils";

export function useResolvedUserRole() {
  const storeRole = useUserStore((state) => state.userInfo?.role);
  const [sessionRole, setSessionRole] = useState<UserRole | null>(null);
  const [isResolved, setIsResolved] = useState(Boolean(storeRole));

  useEffect(() => {
    if (storeRole) {
      setSessionRole(null);
      setIsResolved(true);
      return;
    }

    setSessionRole(getSessionUser()?.role ?? null);
    setIsResolved(true);
  }, [storeRole]);

  return {
    isResolved,
    role: storeRole ?? sessionRole,
  };
}
