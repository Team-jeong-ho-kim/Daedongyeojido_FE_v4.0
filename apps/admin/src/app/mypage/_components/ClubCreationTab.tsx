import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ManualPdfPreviewModal } from "ui";
import { ClubHeader } from "@/components/common";
import {
  useDecideClubApplicationMutation,
  useUploadClubCreationFormMutation,
} from "@/hooks/mutations";
import {
  useGetClubCreationApplicationDetailQuery,
  useGetClubCreationApplicationsQuery,
} from "@/hooks/querys";
import { getDownloadFileName } from "@/lib";
import { toErrorMessage } from "../_lib";
import { PanelCard } from "./PanelCard";

export function ClubCreationTab() {
  const decideClubApplicationMutation = useDecideClubApplicationMutation();
  const clubCreationApplicationsQuery =
    useGetClubCreationApplicationsQuery(false);
  const [isDetailOverlayOpen, setIsDetailOverlayOpen] = useState(false);
  const [selectedClubCreationId, setSelectedClubCreationId] = useState<
    number | null
  >(null);
  const [isClubCreationFormPreviewOpen, setIsClubCreationFormPreviewOpen] =
    useState(false);

  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileInputKey, setUploadFileInputKey] = useState(0);
  const uploadClubCreationFormMutation = useUploadClubCreationFormMutation();

  const clubCreationApplications = clubCreationApplicationsQuery.data ?? [];
  const selectedClubCreationIdValue = selectedClubCreationId
    ? String(selectedClubCreationId)
    : "";
  const selectedClubCreationSummary =
    clubCreationApplications.find(
      (club) => club.clubId === selectedClubCreationId,
    ) ?? null;
  const clubCreationDetailQuery = useGetClubCreationApplicationDetailQuery(
    selectedClubCreationIdValue,
    isDetailOverlayOpen,
  );
  const clubCreationDetail = clubCreationDetailQuery.data;
  const uniqueLinks = clubCreationDetail
    ? [...new Set(clubCreationDetail.club.links.map((link) => link.trim()))]
        .filter(Boolean)
        .sort()
    : [];
  const previewFileName = clubCreationDetail?.clubCreationForm
    ? getDownloadFileName(
        `${clubCreationDetail.club.clubName} 개설 신청 양식`,
        clubCreationDetail.clubCreationForm,
      )
    : "";

  const handleDecideClubApplication = async (
    clubId: number,
    isOpen: boolean,
  ) => {
    try {
      await decideClubApplicationMutation.mutateAsync({
        clubId: String(clubId),
        isOpen,
      });
    } catch {}
  };

  const handleFetchClubCreationApplications = async () => {
    const result = await clubCreationApplicationsQuery.refetch();

    if (result.error) {
      toast.error(
        toErrorMessage(
          result.error,
          "동아리 개설 신청 전체 조회에 실패했습니다.",
        ),
      );
      return;
    }

    toast.success("동아리 개설 신청 목록을 조회했습니다.");
  };

  const handleOpenDetailOverlay = (clubId: number) => {
    setSelectedClubCreationId(clubId);
    setIsDetailOverlayOpen(true);
  };

  const handleUploadClubCreationForm = async () => {
    if (!uploadName.trim() || !uploadFile) {
      toast.error("양식 이름과 양식 파일을 입력해 주세요.");
      return;
    }

    const lowerFileName = uploadFile.name.toLowerCase();
    const isAllowedTemplateFile =
      lowerFileName.endsWith(".pdf") || lowerFileName.endsWith(".hwp");

    if (!isAllowedTemplateFile) {
      toast.error("HWP/PDF 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      await uploadClubCreationFormMutation.mutateAsync({
        fileUrl: uploadFile,
        fileName: uploadName.trim(),
      });
      setUploadName("");
      setUploadFile(null);
      setUploadFileInputKey((prev) => prev + 1);
    } catch {}
  };

  const handleCloseDetailOverlay = () => {
    setIsDetailOverlayOpen(false);
    setSelectedClubCreationId(null);
    setIsClubCreationFormPreviewOpen(false);
  };

  useEffect(() => {
    if (!isDetailOverlayOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseDetailOverlay();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDetailOverlayOpen]);

  useEffect(() => {
    if (!clubCreationDetail?.clubCreationForm) {
      setIsClubCreationFormPreviewOpen(false);
    }
  }, [clubCreationDetail?.clubCreationForm]);

  return (
    <>
      <PanelCard
        title="동아리 개설 신청 전체 조회"
        description="현재 접수된 동아리 개설 신청 목록을 조회하고 바로 승인/거절합니다."
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleFetchClubCreationApplications}
            disabled={clubCreationApplicationsQuery.isFetching}
          >
            {clubCreationApplicationsQuery.isFetching ? "조회 중..." : "조회"}
          </button>
        </div>

        {clubCreationApplicationsQuery.isFetched ? (
          clubCreationApplications.length > 0 ? (
            <div className="mt-4 space-y-3">
              {clubCreationApplications.map((club) => (
                <div
                  key={club.clubId}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition"
                >
                  <button
                    type="button"
                    aria-label={`${club.clubName} 개설 신청 상세 조회`}
                    className="w-full rounded-xl p-3 text-left transition hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-200 md:p-4"
                    onClick={() => handleOpenDetailOverlay(club.clubId)}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                            {club.clubImage ? (
                              <Image
                                src={club.clubImage}
                                alt={`${club.clubName} 동아리 이미지`}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                                이미지 없음
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {club.clubName}
                            </p>
                            <p className="mt-1 text-gray-500 text-xs">
                              신청 ID #{club.clubId}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {club.majors.map((major) => (
                            <span
                              key={`${club.clubId}-${major}`}
                              className="rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[11px] text-gray-600"
                            >
                              {major}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-[#2563EB] px-3 py-1.5 font-medium text-white text-xs transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() =>
                        handleDecideClubApplication(club.clubId, true)
                      }
                      disabled={decideClubApplicationMutation.isPending}
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-[#DC2626] px-3 py-1.5 font-medium text-white text-xs transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() =>
                        handleDecideClubApplication(club.clubId, false)
                      }
                      disabled={decideClubApplicationMutation.isPending}
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-gray-500 text-sm">
              조회된 동아리 개설 신청이 없습니다.
            </p>
          )
        ) : null}
      </PanelCard>

      <PanelCard
        title="동아리 개설 양식 업로드"
        description="한글(HWP) 또는 PDF 양식을 등록합니다."
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
            accept=".hwp,.pdf,application/x-hwp,application/haansofthwp,application/pdf"
            onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-gray-700 file:text-sm focus:border-gray-400"
          />
          <p className="text-gray-500 text-xs">
            {uploadFile
              ? `선택된 파일: ${uploadFile.name}`
              : "HWP/PDF 파일을 선택해 주세요."}
          </p>
        </div>
        <button
          type="button"
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleUploadClubCreationForm}
          disabled={uploadClubCreationFormMutation.isPending}
        >
          {uploadClubCreationFormMutation.isPending ? "업로드 중..." : "업로드"}
        </button>
      </PanelCard>

      {isDetailOverlayOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="상세 조회 오버레이 닫기"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseDetailOverlay}
          />
          <div className="relative h-full overflow-y-auto">
            <div className="flex min-h-full items-start justify-center px-4 py-8 md:px-6">
              <section
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[12px] bg-white shadow-2xl"
              >
                <div className="relative border-gray-100 border-b">
                  <ClubHeader
                    clubImage={
                      clubCreationDetail?.club.clubImage ??
                      selectedClubCreationSummary?.clubImage ??
                      ""
                    }
                    clubName={
                      clubCreationDetail?.club.clubName ??
                      selectedClubCreationSummary?.clubName ??
                      ""
                    }
                    title={
                      clubCreationDetail?.club.clubName ??
                      selectedClubCreationSummary?.clubName ??
                      "상세 정보를 불러오는 중..."
                    }
                    subtitle="동아리 개설 신청"
                    metaText={`개설 신청 ID #${selectedClubCreationId ?? "-"}`}
                    oneLiner={clubCreationDetail?.club.oneLiner}
                  />
                  <button
                    type="button"
                    aria-label="상세 조회 닫기"
                    className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 text-xl transition hover:bg-gray-50 hover:text-gray-700"
                    onClick={handleCloseDetailOverlay}
                  >
                    ×
                  </button>
                </div>

                <div className="bg-gray-50 px-6 py-8 md:px-10 md:py-10">
                  {clubCreationDetailQuery.isPending ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500 text-sm">
                      상세 정보를 불러오는 중...
                    </div>
                  ) : null}

                  {clubCreationDetailQuery.isError ? (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center text-red-700 text-sm">
                      {toErrorMessage(
                        clubCreationDetailQuery.error,
                        "상세 정보를 불러오지 못했습니다.",
                      )}
                    </div>
                  ) : null}

                  {clubCreationDetail ? (
                    <div className="flex flex-col gap-6">
                      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                        <h4 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
                          신청자 정보
                        </h4>
                        <div className="grid flex-1 gap-3 md:grid-cols-2">
                          <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                            <p className="text-[12px] text-gray-400">이름</p>
                            <p className="mt-1 text-[14px] text-gray-700 md:text-[15px]">
                              {clubCreationDetail.userName || "-"}
                            </p>
                          </div>
                          <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                            <p className="text-[12px] text-gray-400">학번</p>
                            <p className="mt-1 text-[14px] text-gray-700 md:text-[15px]">
                              {clubCreationDetail.classNumber || "-"}
                            </p>
                          </div>
                        </div>
                      </section>

                      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                        <h4 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
                          동아리 이미지
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-white">
                            {clubCreationDetail.club.clubImage ? (
                              <Image
                                src={clubCreationDetail.club.clubImage}
                                alt={`${clubCreationDetail.club.clubName} 동아리 이미지`}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[12px] text-gray-400">
                                이미지 없음
                              </div>
                            )}
                          </div>
                        </div>
                      </section>

                      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                        <h4 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
                          동아리명
                        </h4>
                        <div className="flex flex-1 items-center rounded-lg border border-gray-100 bg-white px-4 py-3">
                          <p className="text-[14px] text-gray-700 md:text-[15px]">
                            {clubCreationDetail.club.clubName ?? "-"}
                          </p>
                        </div>
                      </section>

                      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                        <h4 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
                          동아리 전공
                        </h4>
                        <div className="flex flex-1 flex-wrap gap-2">
                          {clubCreationDetail.club.majors?.length ? (
                            clubCreationDetail.club.majors.map((major) => (
                              <span
                                key={`${selectedClubCreationId}-${major}`}
                                className="rounded-full border border-primary-300 px-3 py-1 text-[12px] text-primary-500 md:text-[13px]"
                              >
                                {major}
                              </span>
                            ))
                          ) : (
                            <span className="text-[14px] text-gray-500 md:text-[15px]">
                              전공 정보가 없습니다.
                            </span>
                          )}
                        </div>
                      </section>

                      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                        <h4 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
                          동아리 소개
                        </h4>
                        <div className="flex flex-1 items-start rounded-lg border border-gray-100 bg-white p-4">
                          <p className="text-[14px] text-gray-700 leading-7 md:text-[15px]">
                            {clubCreationDetail.club.introduction ||
                              "소개가 없습니다."}
                          </p>
                        </div>
                      </section>

                      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                        <h4 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
                          동아리 관련 링크
                        </h4>
                        <div className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4">
                          {uniqueLinks.length > 0 ? (
                            uniqueLinks.map((link) => (
                              <a
                                key={link}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all text-[14px] text-gray-600 underline underline-offset-2 hover:text-gray-900 md:text-[15px]"
                              >
                                {link}
                              </a>
                            ))
                          ) : (
                            <p className="text-[14px] text-gray-500 md:text-[15px]">
                              등록된 링크가 없습니다.
                            </p>
                          )}
                        </div>
                      </section>

                      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                        <h4 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
                          개설 신청 양식
                        </h4>
                        <div className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4">
                          {clubCreationDetail.clubCreationForm ? (
                            <>
                              <p className="text-[14px] text-gray-700 md:text-[15px]">
                                {previewFileName}
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setIsClubCreationFormPreviewOpen(true)
                                  }
                                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50"
                                >
                                  미리보기
                                </button>
                              </div>
                            </>
                          ) : (
                            <p className="text-[14px] text-gray-500 md:text-[15px]">
                              등록된 양식이 없습니다.
                            </p>
                          )}
                        </div>
                      </section>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}

      <ManualPdfPreviewModal
        fileName={previewFileName}
        isOpen={isClubCreationFormPreviewOpen}
        onClose={() => setIsClubCreationFormPreviewOpen(false)}
        pdfPath={clubCreationDetail?.clubCreationForm ?? null}
      />
    </>
  );
}
