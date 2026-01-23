"use client";

import { useUserStore } from "shared";
import { StudentHeader } from "ui";
import { clearTokens } from "@/lib/token";

export default function StudentHeaderWrapper() {
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    clearTokens();
    clearUser();
    window.location.href = "/";
  };

  return <StudentHeader onLogout={handleLogout} />;
}
