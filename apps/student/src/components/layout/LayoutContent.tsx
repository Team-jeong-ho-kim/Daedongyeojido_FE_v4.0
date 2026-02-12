"use client";

import { usePathname } from "next/navigation";
import StudentHeaderWrapper from "./StudentHeaderWrapper";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login");

  return (
    <>
      {!isAuthPage && <StudentHeaderWrapper />}
      <div className={isAuthPage ? "" : "pt-14"}>{children}</div>
    </>
  );
}
