"use client";

import { useId, useState } from "react";
import { useLogoutMutation } from "@/hooks/mutations";
import { useGetAdminOverviewQuery } from "@/hooks/querys";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryErrorToast } from "@/hooks/useQueryErrorToast";
import type { ResultDurationResponse } from "@/types/admin";
import {
  AdminProfileHeader,
  AdminSidebar,
  type AdminTab,
  ClubCreationTab,
  DissolutionTab,
  OverviewTab,
  ResultDurationTab,
} from "./_components";

export default function AdminMyPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const logoutModalTitleId = useId();
  const { isAuthorized, isBooting, userInfo } = useAdminAuth();
  const logoutMutation = useLogoutMutation();
  const overviewQuery = useGetAdminOverviewQuery(isAuthorized);
  useQueryErrorToast(
    overviewQuery.error,
    "관리자 데이터를 불러오지 못했습니다.",
  );

  const resultDurationInfo =
    overviewQuery.data?.resultDurationInfo ??
    (null as ResultDurationResponse | null);

  const handleOpenLogoutModal = () => {
    if (logoutMutation.isPending) return;
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    if (logoutMutation.isPending) return;
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setIsLogoutModalOpen(false);
      },
    });
  };

  if (isBooting || (isAuthorized && overviewQuery.isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">
          마이페이지 정보를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white [&_input::placeholder]:text-gray-400 [&_textarea::placeholder]:text-gray-400">
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[170px_1fr]">
          <AdminSidebar
            activeTab={activeTab}
            loadingLogout={logoutMutation.isPending}
            onTabChange={setActiveTab}
            onLogout={handleOpenLogoutModal}
          />

          <section className="pt-10">
            <AdminProfileHeader
              userName={userInfo?.userName}
              role={userInfo?.role}
            />

            <div className="space-y-5">
              {activeTab === "overview" ? (
                <OverviewTab
                  isRefreshingOverview={overviewQuery.isFetching}
                  onRefresh={() => {
                    void overviewQuery.refetch();
                  }}
                  resultDurationInfo={resultDurationInfo}
                />
              ) : null}

              {activeTab === "resultDuration" ? (
                <ResultDurationTab resultDurationInfo={resultDurationInfo} />
              ) : null}

              {activeTab === "clubCreation" ? <ClubCreationTab /> : null}

              {activeTab === "dissolution" ? <DissolutionTab /> : null}
            </div>
          </section>
        </div>
      </div>

      {isLogoutModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            aria-label="로그아웃 확인 모달 닫기"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseLogoutModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={logoutModalTitleId}
            className="relative w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <h2
              id={logoutModalTitleId}
              className="mb-2 font-bold text-[18px] text-gray-900"
            >
              로그아웃 하시겠습니까?
            </h2>
            <p className="mb-8 text-gray-400 text-sm">
              로그아웃하면 관리자 페이지 이용을 위해 다시 로그인해야 합니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseLogoutModal}
                disabled={logoutMutation.isPending}
                className="rounded-[12px] bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={logoutMutation.isPending}
                className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
