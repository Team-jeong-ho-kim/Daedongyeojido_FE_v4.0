"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError, clearTokens, getAccessToken, getSessionUser } from "utils";
import {
  decideClubApplication,
  decideDissolution,
  deleteClubCreationForm,
  downloadClubCreationApplicationForm,
  getClubCreationForm,
  getResultDuration,
  setResultDuration,
  uploadClubCreationForm,
} from "@/api/admin";
import {
  getAllApplicationForms,
  getClubApplicationForms,
} from "@/api/applicationForm";
import { logout } from "@/api/auth";
import { getAllClubs } from "@/api/club";
import type {
  AdminClubCreationForm,
  AdminClubCreationFormDownload,
  ApplicationFormListItem,
  ResultDurationResponse,
} from "@/types/admin";

const moveToWebLogin = () => {
  const webUrl = (process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");
  window.location.href = `${webUrl}/login`;
};

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) return error.description;
  return fallback;
};

const toDateText = (value: [number, number, number] | string | undefined) => {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return `${value[0]}-${String(value[1]).padStart(2, "0")}-${String(value[2]).padStart(2, "0")}`;
};

const getFileExtension = (fileUrl: string, contentType?: string | null) => {
  const urlPath = fileUrl.split("?")[0] ?? fileUrl;
  const extensionMatch = urlPath.match(/(\.[A-Za-z0-9]+)$/);
  if (extensionMatch?.[1]) {
    return extensionMatch[1];
  }

  switch (contentType?.toLowerCase()) {
    case "application/pdf":
      return ".pdf";
    case "application/x-hwp":
    case "application/haansofthwp":
      return ".hwp";
    case "application/zip":
    case "application/octet-stream":
      return "";
    case "application/x-hwpx":
    case "application/vnd.hancom.hwpx":
      return ".hwpx";
    default:
      return "";
  }
};

const getDownloadFileName = (
  fileName: string,
  fileUrl: string,
  contentType?: string | null,
) => {
  const sanitizedFileName = fileName.trim();
  const extension = getFileExtension(fileUrl, contentType);

  if (!sanitizedFileName) {
    return `club-creation-form${extension}`;
  }

  if (!extension) {
    return sanitizedFileName;
  }

  return sanitizedFileName.toLowerCase().endsWith(extension.toLowerCase())
    ? sanitizedFileName
    : `${sanitizedFileName}${extension}`;
};

const triggerFileDownload = (href: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const toResultDurationDateTime = (dateTime: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateTime)) {
    return `${dateTime}T00:00:00`;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateTime)) {
    return dateTime;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateTime)) {
    return `${dateTime}:00`;
  }

  return dateTime;
};

type AdminTab = "overview" | "resultDuration" | "clubCreation" | "dissolution";

type PanelCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
};

function PanelCard(props: PanelCardProps) {
  const { title, description, children, right } = props;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          {description ? (
            <p className="mt-1 text-gray-500 text-sm">{description}</p>
          ) : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export default function AdminMyPage() {
  const [booting, setBooting] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const [userInfo, setUserInfo] = useState<{
    userName: string;
    role: string;
  } | null>(null);

  const [isRefreshingOverview, setIsRefreshingOverview] = useState(false);
  const [resultDurationInfo, setResultDurationInfo] =
    useState<ResultDurationResponse | null>(null);
  const [applicationForms, setApplicationForms] = useState<
    ApplicationFormListItem[]
  >([]);

  const [setResultDate, setSetResultDate] = useState("");
  const [setResultTime, setSetResultTime] = useState("");
  const [isSettingResultDuration, setIsSettingResultDuration] = useState(false);

  const [clubApplicationClubId, setClubApplicationClubId] = useState("");
  const [isDecidingClubApplication, setIsDecidingClubApplication] =
    useState(false);

  const [clubCreationLookupClubId, setClubCreationLookupClubId] = useState("");
  const [clubCreationForm, setClubCreationForm] =
    useState<AdminClubCreationForm | null>(null);
  const [isLoadingClubCreationForm, setIsLoadingClubCreationForm] =
    useState(false);
  const [downloadClubCreationFormId, setDownloadClubCreationFormId] =
    useState("");
  const [downloadClubCreationForm, setDownloadClubCreationForm] =
    useState<AdminClubCreationFormDownload | null>(null);
  const [
    isFetchingDownloadClubCreationForm,
    setIsFetchingDownloadClubCreationForm,
  ] = useState(false);
  const [isDownloadingClubCreationForm, setIsDownloadingClubCreationForm] =
    useState(false);

  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileInputKey, setUploadFileInputKey] = useState(0);
  const [isUploadingClubCreationForm, setIsUploadingClubCreationForm] =
    useState(false);

  const [deleteClubCreationFormId, setDeleteClubCreationFormId] = useState("");
  const [isDeletingClubCreationForm, setIsDeletingClubCreationForm] =
    useState(false);

  const [dissolutionClubId, setDissolutionClubId] = useState("");
  const [isDecidingDissolution, setIsDecidingDissolution] = useState(false);

  const loadOverviewData = useCallback(async () => {
    setIsRefreshingOverview(true);

    try {
      const durationData = await getResultDuration().catch(() => null);

      let formData: ApplicationFormListItem[] = [];

      try {
        formData = await getAllApplicationForms();
      } catch {
        const clubsData = await getAllClubs();
        const formsByClub = await Promise.all(
          clubsData.map(async (club) => {
            try {
              return await getClubApplicationForms(String(club.clubId));
            } catch {
              return [];
            }
          }),
        );
        formData = formsByClub.flat();
      }

      const dedupedFormMap = new Map<number, ApplicationFormListItem>();
      formData.forEach((form) => {
        dedupedFormMap.set(form.applicationFormId, form);
      });

      setResultDurationInfo(durationData);
      setApplicationForms(
        [...dedupedFormMap.values()].sort(
          (a, b) => b.applicationFormId - a.applicationFormId,
        ),
      );
    } catch (error) {
      toast.error(
        toErrorMessage(error, "관리자 데이터를 불러오지 못했습니다."),
      );
    } finally {
      setIsRefreshingOverview(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        moveToWebLogin();
        if (!cancelled) setBooting(false);
        return;
      }

      const sessionUser = getSessionUser();
      if (!sessionUser || sessionUser.role !== "ADMIN") {
        clearTokens();
        moveToWebLogin();
        if (!cancelled) setBooting(false);
        return;
      }

      if (!cancelled) {
        setUserInfo({
          userName: sessionUser.userName,
          role: sessionUser.role,
        });
      }

      await loadOverviewData();

      if (!cancelled) {
        setBooting(false);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [loadOverviewData]);

  const handleLogout = async () => {
    setLoadingLogout(true);

    try {
      await logout();
    } catch (error) {
      toast.error(
        toErrorMessage(error, "로그아웃 처리 중 오류가 발생했습니다."),
      );
    } finally {
      clearTokens();
      moveToWebLogin();
      setLoadingLogout(false);
    }
  };

  const handleSetResultDuration = async () => {
    if (resultDurationInfo?.resultDuration) {
      toast.error("이미 발표 기간이 존재합니다.");
      return;
    }

    if (!setResultDate || !setResultTime) {
      toast.error("설정할 발표 날짜와 시간을 입력해 주세요.");
      return;
    }

    setIsSettingResultDuration(true);
    try {
      await setResultDuration({
        resultDuration: toResultDurationDateTime(
          `${setResultDate}T${setResultTime}`,
        ),
      });
      toast.success("결과 발표 기간을 설정했습니다.");
      setSetResultDate("");
      setSetResultTime("");
      await loadOverviewData();
    } catch (error) {
      toast.error(toErrorMessage(error, "발표 기간 설정에 실패했습니다."));
    } finally {
      setIsSettingResultDuration(false);
    }
  };

  const handleDecideClubApplication = async (isApproved: boolean) => {
    if (!clubApplicationClubId.trim()) {
      toast.error("처리할 동아리 ID를 입력해 주세요.");
      return;
    }

    setIsDecidingClubApplication(true);
    try {
      await decideClubApplication(clubApplicationClubId.trim(), isApproved);
      toast.success(
        isApproved
          ? "동아리 개설을 수락했습니다."
          : "동아리 개설을 거절했습니다.",
      );
      await loadOverviewData();
    } catch (error) {
      toast.error(toErrorMessage(error, "동아리 개설 처리에 실패했습니다."));
    } finally {
      setIsDecidingClubApplication(false);
    }
  };

  const handleFetchClubCreationForm = async () => {
    if (!clubCreationLookupClubId.trim()) {
      toast.error("조회할 동아리 ID를 입력해 주세요.");
      return;
    }

    setIsLoadingClubCreationForm(true);
    try {
      const data = await getClubCreationForm(clubCreationLookupClubId.trim());
      setClubCreationForm(data);
      toast.success("동아리 개설 정보를 조회했습니다.");
    } catch (error) {
      setClubCreationForm(null);
      toast.error(
        toErrorMessage(error, "동아리 개설 정보를 불러오지 못했습니다."),
      );
    } finally {
      setIsLoadingClubCreationForm(false);
      setClubCreationLookupClubId("");
    }
  };

  const handleDownloadClubCreationApplicationForm = async () => {
    if (!downloadClubCreationForm) {
      toast.error("먼저 개설 양식을 조회해 주세요.");
      return;
    }

    setIsDownloadingClubCreationForm(true);
    try {
      const { fileName, fileUrl } = downloadClubCreationForm;
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("파일 다운로드 응답이 올바르지 않습니다.");
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("다운로드한 파일 크기가 비어 있습니다.");
      }

      const downloadFileName = getDownloadFileName(
        fileName,
        fileUrl,
        response.headers.get("content-type") ?? blob.type,
      );

      const objectUrl = URL.createObjectURL(blob);
      triggerFileDownload(objectUrl, downloadFileName);
      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);

      toast.success("동아리 개설 신청 양식을 다운로드했습니다.");
    } catch (error) {
      toast.error(
        toErrorMessage(error, "동아리 개설 신청 양식 다운로드에 실패했습니다."),
      );
    } finally {
      setIsDownloadingClubCreationForm(false);
    }
  };

  const handleFetchDownloadClubCreationForm = async () => {
    if (!downloadClubCreationFormId.trim()) {
      toast.error("조회할 개설 양식 ID를 입력해 주세요.");
      return;
    }

    setIsFetchingDownloadClubCreationForm(true);
    try {
      const data = await downloadClubCreationApplicationForm(
        downloadClubCreationFormId.trim(),
      );
      setDownloadClubCreationForm(data);
      toast.success("동아리 개설 신청 양식을 조회했습니다.");
    } catch (error) {
      setDownloadClubCreationForm(null);
      toast.error(
        toErrorMessage(error, "동아리 개설 신청 양식 조회에 실패했습니다."),
      );
    } finally {
      setIsFetchingDownloadClubCreationForm(false);
    }
  };

  const handleUploadClubCreationForm = async () => {
    if (!uploadName.trim() || !uploadFile) {
      toast.error("양식 이름과 양식 파일을 입력해 주세요.");
      return;
    }

    const lowerFileName = uploadFile.name.toLowerCase();
    const isAllowedTemplateFile =
      lowerFileName.endsWith(".pdf") ||
      lowerFileName.endsWith(".hwp") ||
      lowerFileName.endsWith(".hwpx");

    if (!isAllowedTemplateFile) {
      toast.error("HWP/HWPX/PDF 파일만 업로드할 수 있습니다.");
      return;
    }

    setIsUploadingClubCreationForm(true);
    try {
      await uploadClubCreationForm({
        fileUrl: uploadFile,
        fileName: uploadName.trim(),
      });
      toast.success("동아리 개설 양식을 업로드했습니다.");
      setUploadName("");
      setUploadFile(null);
      setUploadFileInputKey((prev) => prev + 1);
      await loadOverviewData();
    } catch (error) {
      toast.error(
        toErrorMessage(error, "동아리 개설 양식 업로드에 실패했습니다."),
      );
    } finally {
      setIsUploadingClubCreationForm(false);
    }
  };

  const handleDeleteClubCreationForm = async () => {
    if (!deleteClubCreationFormId.trim()) {
      toast.error("삭제할 개설 양식 ID를 입력해 주세요.");
      return;
    }

    setIsDeletingClubCreationForm(true);
    try {
      await deleteClubCreationForm(deleteClubCreationFormId.trim());
      toast.success("동아리 개설 양식을 삭제했습니다.");
      if (
        clubCreationForm &&
        String(clubCreationForm.clubCreationFormId) ===
          deleteClubCreationFormId.trim()
      ) {
        setClubCreationForm(null);
      }
      await loadOverviewData();
    } catch (error) {
      toast.error(
        toErrorMessage(error, "동아리 개설 양식 삭제에 실패했습니다."),
      );
    } finally {
      setIsDeletingClubCreationForm(false);
      setDeleteClubCreationFormId("");
    }
  };

  const handleDecideDissolution = async (isApproved: boolean) => {
    if (!dissolutionClubId.trim()) {
      toast.error("처리할 동아리 ID를 입력해 주세요.");
      return;
    }

    setIsDecidingDissolution(true);
    try {
      await decideDissolution(dissolutionClubId.trim(), isApproved);
      toast.success(
        isApproved
          ? "동아리 해체를 수락했습니다."
          : "동아리 해체를 거절했습니다.",
      );
      await loadOverviewData();
    } catch (error) {
      toast.error(toErrorMessage(error, "동아리 해체 처리에 실패했습니다."));
    } finally {
      setIsDecidingDissolution(false);
    }
  };

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">
          마이페이지 정보를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  const tabButtonClass = (tab: AdminTab) =>
    `w-full whitespace-nowrap px-0 py-2 text-left text-lg transition ${
      activeTab === tab
        ? "font-semibold text-gray-900"
        : "text-gray-400 hover:text-gray-600"
    }`;

  const hasExistingResultDuration = Boolean(resultDurationInfo?.resultDuration);

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white [&_input::placeholder]:text-gray-400 [&_textarea::placeholder]:text-gray-400">
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[170px_1fr]">
          <aside>
            <h1 className="mb-10 font-extrabold text-4xl tracking-tight">
              마이페이지
            </h1>

            <div className="space-y-3">
              <button
                type="button"
                className={tabButtonClass("overview")}
                onClick={() => setActiveTab("overview")}
              >
                조회
              </button>
              <button
                type="button"
                className={tabButtonClass("resultDuration")}
                onClick={() => setActiveTab("resultDuration")}
              >
                결과 발표 기간
              </button>
              <button
                type="button"
                className={tabButtonClass("clubCreation")}
                onClick={() => setActiveTab("clubCreation")}
              >
                동아리 개설
              </button>
              <button
                type="button"
                className={tabButtonClass("dissolution")}
                onClick={() => setActiveTab("dissolution")}
              >
                동아리 해체
              </button>
              <button
                type="button"
                className="w-full whitespace-nowrap px-0 py-2 text-left font-medium text-gray-500 text-lg transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleLogout}
                disabled={loadingLogout}
              >
                {loadingLogout ? "로그아웃 중..." : "로그아웃"}
              </button>
            </div>
          </aside>

          <section className="pt-10">
            <div className="mb-10 flex items-center gap-8">
              <Image
                src="/admin-profile-default.svg"
                alt="프로필 이미지"
                className="h-20 w-20 rounded-full object-cover"
                width={80}
                height={80}
              />
              <div>
                <h2 className="font-semibold text-3xl tracking-tight">
                  {userInfo?.userName}
                </h2>
                <p className="mt-2 font-medium text-gray-400 text-xl">
                  {userInfo?.role || "ADMIN"}
                </p>
              </div>
            </div>
            <div className="mb-10 h-px w-full bg-gray-200"></div>

            <div className="space-y-5">
              {activeTab === "overview" ? (
                <>
                  <PanelCard
                    title="조회 통합"
                    description="발표 기간과 지원서 폼을 한 번에 확인합니다."
                    right={
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={loadOverviewData}
                        disabled={isRefreshingOverview}
                      >
                        {isRefreshingOverview ? "새로고침 중..." : "새로고침"}
                      </button>
                    }
                  >
                    <div className="rounded-xl bg-gray-50 p-4 text-sm">
                      <p className="font-medium text-gray-700">
                        발표 기간 조회
                      </p>
                      <p className="mt-1 text-gray-900">
                        {resultDurationInfo?.resultDuration ||
                          "설정된 발표 기간이 없습니다."}
                      </p>
                    </div>
                  </PanelCard>

                  <PanelCard
                    title="지원서 폼 전체 조회"
                    description={`전체 ${applicationForms.length}개 지원서 폼`}
                  >
                    <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                      {applicationForms.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          지원서 폼이 없습니다.
                        </p>
                      ) : (
                        applicationForms.map((form) => (
                          <div
                            key={form.applicationFormId}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                          >
                            <p className="font-medium">
                              {form.applicationFormTitle}
                            </p>
                            <p className="mt-1 text-gray-500 text-xs">
                              폼 ID #{form.applicationFormId} · {form.clubName}
                            </p>
                            <p className="text-gray-500 text-xs">
                              마감: {toDateText(form.submissionDuration)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </PanelCard>
                </>
              ) : null}

              {activeTab === "resultDuration" ? (
                <>
                  <PanelCard
                    title="발표 기간 조회"
                    description="현재 결과 발표 기간입니다."
                  >
                    <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm">
                      {resultDurationInfo?.resultDuration ||
                        "설정된 발표 기간이 없습니다."}
                    </p>
                  </PanelCard>

                  <PanelCard
                    title="결과 발표 기간 설정"
                    description="발표 날짜와 시간을 입력해 새 기간을 생성합니다."
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="date"
                        value={setResultDate}
                        onChange={(event) =>
                          setSetResultDate(event.target.value)
                        }
                        placeholder="발표일"
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      />
                      <input
                        type="time"
                        value={setResultTime}
                        onChange={(event) =>
                          setSetResultTime(event.target.value)
                        }
                        placeholder="발표 시간"
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      />
                    </div>
                    <button
                      type="button"
                      className={`mt-3 rounded-lg px-4 py-2 font-medium text-sm text-white transition ${
                        hasExistingResultDuration
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-gray-900 hover:bg-black"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                      onClick={handleSetResultDuration}
                      disabled={isSettingResultDuration}
                      aria-disabled={hasExistingResultDuration}
                    >
                      {isSettingResultDuration ? "설정 중..." : "설정"}
                    </button>
                  </PanelCard>
                </>
              ) : null}

              {activeTab === "clubCreation" ? (
                <>
                  <PanelCard
                    title="동아리 개설 수락/거절"
                    description="동아리 개설 신청 ID(=동아리 ID)를 입력해 승인/거절합니다."
                  >
                    <div className="flex flex-wrap gap-2">
                      <input
                        value={clubApplicationClubId}
                        onChange={(event) =>
                          setClubApplicationClubId(event.target.value)
                        }
                        placeholder="동아리 ID"
                        className="w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      />
                      <button
                        type="button"
                        className="rounded-lg bg-[#2563EB] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleDecideClubApplication(true)}
                        disabled={isDecidingClubApplication}
                      >
                        수락
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-[#DC2626] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleDecideClubApplication(false)}
                        disabled={isDecidingClubApplication}
                      >
                        거절
                      </button>
                    </div>
                  </PanelCard>

                  <PanelCard
                    title="동아리 개설 정보 조회"
                    description="동아리 ID로 개설 정보를 조회합니다."
                  >
                    <div className="flex flex-wrap gap-2">
                      <input
                        value={clubCreationLookupClubId}
                        onChange={(event) =>
                          setClubCreationLookupClubId(event.target.value)
                        }
                        placeholder="동아리 ID"
                        className="w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      />
                      <button
                        type="button"
                        className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleFetchClubCreationForm}
                        disabled={isLoadingClubCreationForm}
                      >
                        {isLoadingClubCreationForm ? "조회 중..." : "조회"}
                      </button>
                    </div>

                    {clubCreationForm ? (
                      <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
                        <p className="font-medium">{clubCreationForm.title}</p>
                        <p className="mt-1 text-gray-600">
                          양식 ID: {clubCreationForm.clubCreationFormId} ·
                          동아리 ID: {clubCreationForm.clubId}
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-gray-800 leading-relaxed">
                          {clubCreationForm.description}
                        </p>
                      </div>
                    ) : null}
                  </PanelCard>

                  <PanelCard
                    title="동아리 개설 신청 양식 조회 및 다운로드"
                    description="개설 양식 ID로 신청 양식을 조회한 뒤 다운로드합니다."
                  >
                    <div className="flex flex-wrap gap-2">
                      <input
                        value={downloadClubCreationFormId}
                        onChange={(event) => {
                          setDownloadClubCreationFormId(event.target.value);
                          setDownloadClubCreationForm(null);
                        }}
                        placeholder="개설 양식 ID"
                        className="w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      />
                      <button
                        type="button"
                        className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleFetchDownloadClubCreationForm}
                        disabled={isFetchingDownloadClubCreationForm}
                      >
                        {isFetchingDownloadClubCreationForm
                          ? "조회 중..."
                          : "조회"}
                      </button>
                    </div>

                    {downloadClubCreationForm ? (
                      <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
                        <p className="font-medium text-gray-900">
                          {getDownloadFileName(
                            downloadClubCreationForm.fileName,
                            downloadClubCreationForm.fileUrl,
                          )}
                        </p>
                        <p className="mt-1 break-all text-gray-600">
                          {downloadClubCreationForm.fileUrl}
                        </p>
                        <button
                          type="button"
                          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={handleDownloadClubCreationApplicationForm}
                          disabled={isDownloadingClubCreationForm}
                        >
                          {isDownloadingClubCreationForm
                            ? "다운로드 중..."
                            : "다운로드"}
                        </button>
                      </div>
                    ) : null}
                  </PanelCard>

                  <PanelCard
                    title="동아리 개설 양식 업로드"
                    description="한글(HWP/HWPX) 또는 PDF 양식을 등록합니다."
                  >
                    <div className="space-y-3">
                      <input
                        value={uploadName}
                        onChange={(event) => setUploadName(event.target.value)}
                        placeholder="양식 이름"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      />
                      <input
                        key={uploadFileInputKey}
                        type="file"
                        accept=".hwp,.hwpx,.pdf,application/x-hwp,application/haansofthwp,application/pdf"
                        onChange={(event) =>
                          setUploadFile(event.target.files?.[0] ?? null)
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-gray-700 file:text-sm focus:border-gray-400"
                      />
                      <p className="text-gray-500 text-xs">
                        {uploadFile
                          ? `선택된 파일: ${uploadFile.name}`
                          : "HWP/HWPX/PDF 파일을 선택해 주세요."}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-3 rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleUploadClubCreationForm}
                      disabled={isUploadingClubCreationForm}
                    >
                      {isUploadingClubCreationForm ? "업로드 중..." : "업로드"}
                    </button>
                  </PanelCard>

                  <PanelCard
                    title="동아리 개설 양식 삭제"
                    description="개설 양식 ID를 입력해 삭제합니다."
                  >
                    <div className="flex flex-wrap gap-2">
                      <input
                        value={deleteClubCreationFormId}
                        onChange={(event) =>
                          setDeleteClubCreationFormId(event.target.value)
                        }
                        placeholder="개설 양식 ID"
                        className="w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                      />
                      <button
                        type="button"
                        className="rounded-lg bg-[#DC2626] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleDeleteClubCreationForm}
                        disabled={isDeletingClubCreationForm}
                      >
                        {isDeletingClubCreationForm ? "삭제 중..." : "삭제"}
                      </button>
                    </div>
                  </PanelCard>
                </>
              ) : null}

              {activeTab === "dissolution" ? (
                <PanelCard
                  title="동아리 해체 수락/거절"
                  description="해체 요청이 온 동아리 ID를 입력해 처리합니다."
                >
                  <div className="flex flex-wrap gap-2">
                    <input
                      value={dissolutionClubId}
                      onChange={(event) =>
                        setDissolutionClubId(event.target.value)
                      }
                      placeholder="동아리 ID"
                      className="w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                    />
                    <button
                      type="button"
                      className="rounded-lg bg-[#2563EB] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleDecideDissolution(true)}
                      disabled={isDecidingDissolution}
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-[#DC2626] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handleDecideDissolution(false)}
                      disabled={isDecidingDissolution}
                    >
                      거절
                    </button>
                  </div>
                </PanelCard>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
