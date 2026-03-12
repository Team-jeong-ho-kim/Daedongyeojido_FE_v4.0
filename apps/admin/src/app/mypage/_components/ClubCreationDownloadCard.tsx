import { useState } from "react";
import { toast } from "sonner";
import { useGetClubCreationDownloadMutation } from "@/hooks/mutations";
import { downloadFileFromUrl, toErrorMessage } from "../_lib";
import { ClubCreationDownloadPreview } from "./ClubCreationDownloadPreview";
import { PanelCard } from "./PanelCard";

type ClubCreationDownloadCardProps = {
  onFetchedFormIdChange?: (clubCreationFormId: number | null) => void;
};

export function ClubCreationDownloadCard(props: ClubCreationDownloadCardProps) {
  const { onFetchedFormIdChange } = props;
  const clubCreationDownloadMutation = useGetClubCreationDownloadMutation();
  const [isDownloadingClubCreationForm, setIsDownloadingClubCreationForm] =
    useState(false);

  const downloadClubCreationForm = clubCreationDownloadMutation.data ?? null;

  const handleFetchDownloadClubCreationForm = async () => {
    try {
      const result = await clubCreationDownloadMutation.mutateAsync();
      onFetchedFormIdChange?.(result.clubCreationFormId ?? null);
    } catch {}
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

  return (
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
  );
}
