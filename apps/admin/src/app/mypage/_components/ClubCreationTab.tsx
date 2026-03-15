import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDecideClubApplicationMutation,
  useUploadClubCreationFormMutation,
} from "@/hooks/mutations";
import { useGetClubCreationApplicationsQuery } from "@/hooks/querys";
import { toErrorMessage } from "../_lib";
import { PanelCard } from "./PanelCard";

export function ClubCreationTab() {
  const decideClubApplicationMutation = useDecideClubApplicationMutation();
  const clubCreationApplicationsQuery =
    useGetClubCreationApplicationsQuery(false);
  const [detailClubCreationIdInput, setDetailClubCreationIdInput] =
    useState("");
  const [isDetailOverlayOpen, setIsDetailOverlayOpen] = useState(false);
  const [selectedDetailClubCreationId, setSelectedDetailClubCreationId] =
    useState<number | null>(null);

  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileInputKey, setUploadFileInputKey] = useState(0);
  const uploadClubCreationFormMutation = useUploadClubCreationFormMutation();

  const clubCreationApplications = clubCreationApplicationsQuery.data ?? [];
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

  const handleOpenDetailOverlay = () => {
    const parsedClubCreationId = Number(detailClubCreationIdInput.trim());

    if (
      !detailClubCreationIdInput.trim() ||
      !Number.isInteger(parsedClubCreationId) ||
      parsedClubCreationId <= 0
    ) {
      toast.error("조회할 개설 신청 ID를 올바르게 입력해 주세요.");
      return;
    }

    setSelectedDetailClubCreationId(parsedClubCreationId);
    setIsDetailOverlayOpen(true);
  };

  const handleCloseDetailOverlay = () => {
    setIsDetailOverlayOpen(false);
  };

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
                <article
                  key={club.clubId}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition"
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
                    <div className="flex flex-wrap gap-2">
                      <p className="mt-3 text-gray-700 text-sm">
                        {club.introduction || "소개가 없습니다."}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
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
                </article>
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
        title="동아리 개설 신청 상세 조회"
        description="개설 신청 ID를 입력해 상세 조회 화면 레이아웃을 확인합니다."
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={detailClubCreationIdInput}
            onChange={(event) =>
              setDetailClubCreationIdInput(event.target.value)
            }
            placeholder="개설 신청 ID"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none [appearance:textfield] focus:border-gray-400 md:max-w-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black"
            onClick={handleOpenDetailOverlay}
          >
            상세 조회
          </button>
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="상세 조회 오버레이 닫기"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseDetailOverlay}
          />
          <section className="relative z-10 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-xl">
                  동아리 개설 신청 상세 조회
                </h3>
                <p className="mt-2 text-gray-500 text-sm">
                  개설 신청 ID #{selectedDetailClubCreationId ?? "-"}
                </p>
              </div>
              <button
                type="button"
                aria-label="상세 조회 닫기"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 text-xl transition hover:bg-gray-50 hover:text-gray-700"
                onClick={handleCloseDetailOverlay}
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-medium text-gray-600 text-sm">신청 ID</p>
                <div className="mt-3 rounded-xl border border-gray-200 border-dashed bg-white px-4 py-3 text-gray-900 text-sm">
                  #{selectedDetailClubCreationId ?? "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-medium text-gray-600 text-sm">동아리명</p>
                <div className="mt-3 rounded-xl border border-gray-200 border-dashed bg-white px-4 py-3 text-gray-400 text-sm">
                  -
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:col-span-2">
                <p className="font-medium text-gray-600 text-sm">소개</p>
                <div className="mt-3 min-h-28 rounded-xl border border-gray-200 border-dashed bg-white px-4 py-3 text-gray-400 text-sm">
                  -
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-medium text-gray-600 text-sm">전공</p>
                <div className="mt-3 flex min-h-16 items-center rounded-xl border border-gray-200 border-dashed bg-white px-4 py-3 text-gray-400 text-sm">
                  -
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-medium text-gray-600 text-sm">
                  동아리 이미지
                </p>
                <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-gray-200 border-dashed bg-white text-gray-400 text-sm">
                  이미지 자리
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
