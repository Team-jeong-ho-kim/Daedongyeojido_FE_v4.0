"use client";

import AdminHeader from "./AdminHeader";

type AdminLayoutContentProps = {
  children: React.ReactNode;
};

export default function AdminLayoutContent(props: AdminLayoutContentProps) {
  const { children } = props;

  return (
    <>
      <AdminHeader />
      <div className="pt-14" data-layout-content-offset>
        {children}
      </div>
    </>
  );
}
