"use client";

import StudentHeaderWrapper from "./StudentHeaderWrapper";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudentHeaderWrapper />
      <div className="pt-14">{children}</div>
    </>
  );
}
