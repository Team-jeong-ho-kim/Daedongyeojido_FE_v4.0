"use client";

import { useUserStore } from "shared";
import { StudentHeader } from "ui";
import { useLogoutMutation } from "@/hooks/mutations/useAuth";

export default function StudentHeaderWrapper() {
  const clearUser = useUserStore((state) => state.clearUser);
  const { mutate: logout } = useLogoutMutation(clearUser);

  const handleLogout = () => {
    logout();
  };

  return <StudentHeader onLogout={handleLogout} />;
}
