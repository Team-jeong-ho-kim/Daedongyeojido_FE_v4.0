"use client";

import { AdminSessionProvider } from "./AdminSessionProvider";
import { QueryProvider } from "./QueryProvider";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AdminSessionProvider>{children}</AdminSessionProvider>
    </QueryProvider>
  );
}
