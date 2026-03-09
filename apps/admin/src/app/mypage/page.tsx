"use client";

import { useState } from "react";
import { useLogoutMutation } from "@/hooks/mutations";
import { useGetAdminOverviewQuery } from "@/hooks/querys";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryErrorToast } from "@/hooks/useQueryErrorToast";
import type {
  ApplicationFormListItem,
  ResultDurationResponse,
} from "@/types/admin";
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
  const { isAuthorized, isBooting, userInfo } = useAdminAuth();
  const logoutMutation = useLogoutMutation();
  const overviewQuery = useGetAdminOverviewQuery(isAuthorized);
  useQueryErrorToast(
    overviewQuery.error,
    "관리자 데이터를 불러오지 못했습니다.",
  );

  const applicationForms =
    overviewQuery.data?.applicationForms ?? ([] as ApplicationFormListItem[]);
  const resultDurationInfo =
    overviewQuery.data?.resultDurationInfo ??
    (null as ResultDurationResponse | null);

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
            onLogout={() => logoutMutation.mutate()}
          />

          <section className="pt-10">
            <AdminProfileHeader
              userName={userInfo?.userName}
              role={userInfo?.role}
            />

            <div className="space-y-5">
              {activeTab === "overview" ? (
                <OverviewTab
                  applicationForms={applicationForms}
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
    </div>
  );
}
