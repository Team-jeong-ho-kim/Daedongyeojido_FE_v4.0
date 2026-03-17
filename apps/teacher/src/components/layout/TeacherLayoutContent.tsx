"use client";

import { TeacherHeader } from "./TeacherHeader";

type TeacherLayoutContentProps = {
  children: React.ReactNode;
};

export function TeacherLayoutContent(props: TeacherLayoutContentProps) {
  const { children } = props;

  return (
    <>
      <TeacherHeader />
      <div className="pt-14" data-layout-content-offset>
        {children}
      </div>
    </>
  );
}
