import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDecideClubApplicationMutation,
  useDeleteClubCreationFormMutation,
  useGetClubCreationDownloadMutation,
  useUploadClubCreationFormMutation,
} from "@/hooks/mutations";
import { useGetClubCreationApplicationsQuery } from "@/hooks/querys";
import { downloadFileFromUrl, toErrorMessage } from "../_lib";
import { ClubCreationDownloadPreview } from "./ClubCreationDownloadPreview";
import { PanelCard } from "./PanelCard";

export function ClubCreationTab() {
  const decideClubApplicationMutation = useDecideClubApplicationMutation();

  const clubCreationDownloadMutation = useGetClubCreationDownloadMutation();
  const [isDownloadingClubCreationForm, setIsDownloadingClubCreationForm] =
    useState(false);
  const clubCreationApplicationsQuery =
    useGetClubCreationApplicationsQuery(false);

  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileInputKey, setUploadFileInputKey] = useState(0);
  const uploadClubCreationFormMutation = useUploadClubCreationFormMutation();

  const deleteClubCreationFormMutation = useDeleteClubCreationFormMutation();

  const downloadClubCreationForm = clubCreationDownloadMutation.data ?? null;
  const clubCreationFormId =
    downloadClubCreationForm?.clubCreationFormId ?? null;
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

  const handleFetchDownloadClubCreationForm = async () => {
    try {
      await clubCreationDownloadMutation.mutateAsync();
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

  const handleDownloadClubCreationApplicationForm = async () => {
    if (!downloadClubCreationForm) {
      toast.error("먼저 개설 양식을 조회해 주세요.");
      return;
    }

    setIsDownloadingClubCreationForm(true);
    try {
      const { fileName, fileUrl } = downloadClubCreationForm;
      await downloadFileFromUrl(fileUrl, fileName);
      toast.success("동아리 개설 신청 양식을 다운로드했습니다.");
    } catch (error) {
      toast.error(
        toErrorMessage(error, "동아리 개설 신청 양식 다운로드에 실패했습니다."),
      );
    } finally {
      setIsDownloadingClubCreationForm(false);
    }
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
      clubCreationDownloadMutation.reset();
      setUploadName("");
      setUploadFile(null);
      setUploadFileInputKey((prev) => prev + 1);
    } catch {}
  };

  const handleDeleteClubCreationForm = async () => {
    if (!clubCreationFormId) {
      toast.error("먼저 삭제할 개설 양식을 조회해 주세요.");
      return;
    }

    try {
      await deleteClubCreationFormMutation.mutateAsync(clubCreationFormId);
      clubCreationDownloadMutation.reset();
    } catch {}
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
        title="동아리 개설 신청 양식 조회 및 다운로드"
        description="신청 양식을 조회한 뒤 다운로드합니다."
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleFetchDownloadClubCreationForm}
            disabled={clubCreationDownloadMutation.isPending}
          >
            {clubCreationDownloadMutation.isPending ? "조회 중..." : "조회"}
          </button>
        </div>

        {downloadClubCreationForm ? (
          <ClubCreationDownloadPreview
            downloadClubCreationForm={downloadClubCreationForm}
            isDownloadingClubCreationForm={isDownloadingClubCreationForm}
            onDownload={handleDownloadClubCreationApplicationForm}
          />
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

      <PanelCard
        title="동아리 개설 양식 삭제"
        description="조회한 개설 양식을 바로 삭제합니다."
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-gray-600 text-sm">
            {clubCreationFormId
              ? `조회된 개설 양식 ID: ${clubCreationFormId}`
              : "먼저 상단에서 개설 양식을 조회해 주세요."}
          </p>
          <button
            type="button"
            className="rounded-lg bg-[#DC2626] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleDeleteClubCreationForm}
            disabled={
              deleteClubCreationFormMutation.isPending || !clubCreationFormId
            }
          >
            {deleteClubCreationFormMutation.isPending ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </PanelCard>
    </>
  );
}
