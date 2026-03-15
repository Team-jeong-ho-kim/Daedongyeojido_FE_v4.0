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
      <div className="pt-14" data-layout-content-offset>
        {children}
      </div>
    </>
  );
}
