"use client";

import Link from "next/link";
import { useState } from "react";
import { SkeletonListItem, useDeferredLoading } from "ui";
import { Pagination } from "@/components/common/Pagination";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import { useGetUserAlarmsQuery } from "@/hooks/querys/useApplicationFormQuery";
import { EmptyNotifications, NotificationItem } from "./components";
import { ITEMS_PER_PAGE } from "./constants/notifications";
import { useNotificationActions } from "./hooks/useNotificationActions";
import { useNotificationModal } from "./hooks/useNotificationModal";

export default function NotificationsPage() {
  const [curPage, setCurPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: alarmsData, isPending } = useGetUserAlarmsQuery();
  const showSkeleton = useDeferredLoading(isPending);

  const alarms = (alarmsData || []).sort((a, b) => b.id - a.id);
  const offset = (curPage - 1) * ITEMS_PER_PAGE;
  const currentAlarms = alarms.slice(offset, offset + ITEMS_PER_PAGE);

  const { confirmModal, openModal, closeModal, getModalContent } =
    useNotificationModal();

  const { handleConfirm } = useNotificationActions({
    alarms,
    closeModal,
  });

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">알림함</span>
        </div>

        {/* Page Title */}
        <h1 className="mb-12 font-extrabold text-3xl tracking-tight">알림함</h1>

        {/* Content */}
        {showSkeleton ? (
          <div className="space-y-4">
            {Array.from({ length: ITEMS_PER_PAGE }, () => (
              <SkeletonListItem key={crypto.randomUUID()} />
            ))}
          </div>
        ) : alarms.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <>
            <div className="space-y-4">
              {currentAlarms.map((alarm) => (
                <NotificationItem
                  key={alarm.id}
                  alarm={alarm}
                  isExpanded={expandedId === alarm.id}
                  onToggle={() => handleToggleExpand(alarm.id)}
                  onAction={openModal}
                />
              ))}
            </div>

            {alarms.length > ITEMS_PER_PAGE && (
              <div className="mt-12">
                <Pagination
                  listLen={alarms.length}
                  limit={ITEMS_PER_PAGE}
                  curPage={curPage}
                  setCurPage={setCurPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ApplicationConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={() => handleConfirm(confirmModal)}
        onBackdropClick={closeModal}
        {...getModalContent()}
      />
    </div>
  );
}
