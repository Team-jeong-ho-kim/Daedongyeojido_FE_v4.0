"use client";

import { useUserStore } from "shared";
import { StudentHeader } from "ui";
import { useLogoutMutation } from "@/hooks/mutations/useAuth";

export default function StudentHeaderWrapper() {
  const clearUser = useUserStore((state) => state.clearUser);
  const { mutate: logout } = useLogoutMutation();

  const handleLogout = () => {
    logout();
    clearUser();
  };

  return <StudentHeader onLogout={handleLogout} />;
}
