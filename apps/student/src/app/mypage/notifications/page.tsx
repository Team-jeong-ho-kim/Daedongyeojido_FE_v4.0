"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { SkeletonListItem, useDeferredLoading } from "ui";
import { Pagination } from "@/components/common/Pagination";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import {
  useAcceptMemberRequestMutation,
  useRejectMemberRequestMutation,
  useSelectClubSubmissionMutation,
} from "@/hooks/mutations/useAlarm";
import { useGetUserAlarmsQuery } from "@/hooks/querys/useApplicationFormQuery";
import type { AlarmCategory } from "@/types";

export default function NotificationsPage() {
  const [curPage, setCurPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "accept" | "reject";
    alarmId: number | null;
    category: AlarmCategory | null;
  }>({
    isOpen: false,
    type: "accept",
    alarmId: null,
    category: null,
  });
  const limit = 5;

  const { data: alarmsData, isPending } = useGetUserAlarmsQuery();
  const { mutate: acceptMemberRequest } = useAcceptMemberRequestMutation();
  const { mutate: rejectMemberRequest } = useRejectMemberRequestMutation();
  const { mutate: selectClubSubmission } = useSelectClubSubmissionMutation();
  const showSkeleton = useDeferredLoading(isPending);

  // 최신순 정렬 (ID 내림차순)
  const alarms = (alarmsData || []).sort((a, b) => b.id - a.id);

  const offset = (curPage - 1) * limit;
  const currentAlarms = alarms.slice(offset, offset + limit);

  const handleNotificationClick = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAcceptClick = (
    e: React.MouseEvent,
    alarmId: number,
    category: AlarmCategory,
  ) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      type: "accept",
      alarmId,
      category,
    });
  };

  const handleRejectClick = (
    e: React.MouseEvent,
    alarmId: number,
    category: AlarmCategory,
  ) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      type: "reject",
      alarmId,
      category,
    });
  };

  const handleConfirm = () => {
    if (confirmModal.alarmId === null || confirmModal.category === null) {
      return;
    }

    const alarm = alarms.find((a) => a.id === confirmModal.alarmId);

    if (!alarm) {
      toast.error("알림 정보를 찾을 수 없습니다.");
      return;
    }

    if (confirmModal.category === "CLUB_ACCEPTED") {
      // 동아리 합격 - 합류/거절 결정
      selectClubSubmission({
        isSelected: confirmModal.type === "accept",
        alarmId: confirmModal.alarmId,
      });
    } else if (confirmModal.category === "CLUB_MEMBER_APPLY") {
      // 팀원 추가 신청 - 수락/거절
      if (confirmModal.type === "accept") {
        acceptMemberRequest(confirmModal.alarmId);
      } else {
        rejectMemberRequest(confirmModal.alarmId);
      }
    }

    setConfirmModal({
      isOpen: false,
      type: "accept",
      alarmId: null,
      category: null,
    });
  };

  const handleCloseModal = () => {
    setConfirmModal({
      isOpen: false,
      type: "accept",
      alarmId: null,
      category: null,
    });
  };

  const getModalContent = () => {
    const { type, category } = confirmModal;

    let title = "";
    let confirmText = "";

    if (category === "CLUB_MEMBER_APPLY") {
      // 팀원 추가 신청
      if (type === "accept") {
        title = "팀원 추가 신청을 수락하시겠습니까?";
        confirmText = "수락";
      } else {
        title = "팀원 추가 신청을 거절하시겠습니까?";
        confirmText = "거절";
      }
    } else if (category === "CLUB_ACCEPTED") {
      // 동아리 합격
      if (type === "accept") {
        title = "동아리에 합류하시겠습니까?";
        confirmText = "합류";
      } else {
        title = "동아리 합류를 거절하시겠습니까?";
        confirmText = "거절";
      }
    }

    return {
      title,
      description: "이 작업은 되돌릴 수 없습니다.",
      confirmText,
      cancelText: "닫기",
    };
  };

  const getActionButtons = (
    category: AlarmCategory,
    alarmId: number,
    isExecuted?: boolean,
  ) => {
    if (category === "COMMON") return null;
    if (isExecuted) return null;

    const acceptText = category === "CLUB_ACCEPTED" ? "합류" : "수락";

    return (
      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={(e) => handleRejectClick(e, alarmId, category)}
          className="rounded-lg bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500"
        >
          거절
        </button>
        <button
          type="button"
          onClick={(e) => handleAcceptClick(e, alarmId, category)}
          className="rounded-lg bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d]"
        >
          {acceptText}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">알림함</span>
        </div>
        <h1 className="mb-12 font-extrabold text-3xl tracking-tight">알림함</h1>

        {showSkeleton ? (
          <div className="space-y-4">
            {Array.from({ length: limit }, () => (
              <SkeletonListItem key={crypto.randomUUID()} />
            ))}
          </div>
        ) : alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Image
              src="/images/icons/redTiger.svg"
              alt="알림 없음"
              width={194}
              height={201}
              className="mb-8"
            />
            <p className="text-center text-base text-gray-500">
              알림함이 비어있어요
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentAlarms.map((alarm) => {
                const isExpanded = expandedId === alarm.id;
                return (
                  <div
                    key={alarm.id}
                    className="overflow-hidden rounded-2xl bg-gray-50 transition-colors hover:bg-gray-100"
                  >
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(alarm.id)}
                      className="flex w-full items-center justify-between px-8 py-6"
                    >
                      <span className="font-medium text-base text-gray-900">
                        {alarm.title}
                      </span>
                      <div className="flex items-center gap-6">
                        <div
                          className="transition-transform duration-300"
                          style={{
                            transform: isExpanded
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <Image
                            src="/images/clubs/rightArrow.svg"
                            alt="상세보기"
                            width={10}
                            height={18}
                          />
                        </div>
                      </div>
                    </button>
                    <div
                      className="transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: isExpanded ? "300px" : "0px",
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <div className="border-gray-200 border-t px-8 py-6">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {alarm.content}
                        </p>
                        {isExpanded &&
                          getActionButtons(
                            alarm.category,
                            alarm.id,
                            alarm.isExecuted,
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {alarms.length > limit && (
              <div className="mt-12">
                <Pagination
                  listLen={alarms.length}
                  limit={limit}
                  curPage={curPage}
                  setCurPage={setCurPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ApplicationConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        onBackdropClick={handleCloseModal}
        {...getModalContent()}
      />
    </div>
  );
}
