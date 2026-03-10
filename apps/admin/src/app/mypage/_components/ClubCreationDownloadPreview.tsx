import type { AdminClubCreationFormDownload } from "@/types/admin";
import { getDownloadFileName } from "../_lib";

type ClubCreationDownloadPreviewProps = {
  downloadClubCreationForm: AdminClubCreationFormDownload;
  isDownloadingClubCreationForm: boolean;
  onDownload: () => void;
};

export function ClubCreationDownloadPreview(
  props: ClubCreationDownloadPreviewProps,
) {
  const {
    downloadClubCreationForm,
    isDownloadingClubCreationForm,
    onDownload,
  } = props;

  return (
    <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
      <p className="font-medium text-gray-900">
        {getDownloadFileName(
          downloadClubCreationForm.fileName,
          downloadClubCreationForm.fileUrl,
        )}
      </p>
      <button
        type="button"
        className="mt-3 rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onDownload}
        disabled={isDownloadingClubCreationForm}
      >
        {isDownloadingClubCreationForm ? "다운로드 중..." : "다운로드"}
      </button>
    </div>
  );
}
