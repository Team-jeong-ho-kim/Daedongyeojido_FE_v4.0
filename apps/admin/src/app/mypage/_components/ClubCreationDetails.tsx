import type { AdminClubCreationForm } from "@/types/admin";

type ClubCreationDetailsProps = {
  clubCreationForm: AdminClubCreationForm;
  isDownloadingCreationSubmissionForm: boolean;
  onDownloadCreationSubmissionForm: () => void;
};

export function ClubCreationDetails(props: ClubCreationDetailsProps) {
  const {
    clubCreationForm,
    isDownloadingCreationSubmissionForm,
    onDownloadCreationSubmissionForm,
  } = props;
  const uniqueClubCreationLinks = [...new Set(clubCreationForm.club.links)];

  return (
    <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
      <div className="flex flex-wrap items-start gap-4">
        {/* biome-ignore lint/performance/noImgElement: Admin page displays external S3 image URLs without Next remotePatterns config. */}
        <img
          src={clubCreationForm.club.clubImage}
          alt={clubCreationForm.club.clubName}
          className="h-20 w-20 rounded-xl border border-gray-200 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-base text-gray-900">
            {clubCreationForm.club.clubName}
          </p>
          <p className="mt-1 text-gray-600 text-sm">
            신청자: {clubCreationForm.userName} · 학번:{" "}
            {clubCreationForm.classNumber}
          </p>
          <p className="mt-3 text-gray-500 text-xs">한줄 소개</p>
          <p className="mt-1 text-gray-900 text-sm">
            {clubCreationForm.club.oneLiner}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-gray-500 text-xs">동아리 소개</p>
          <p className="mt-1 whitespace-pre-wrap text-gray-800 leading-relaxed">
            {clubCreationForm.club.introduction}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">전공</p>
          <p className="mt-1 text-gray-900 text-sm">
            {clubCreationForm.club.majors.join(", ")}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">관련 링크</p>
          <div className="mt-1 space-y-1">
            {uniqueClubCreationLinks.length > 0 ? (
              uniqueClubCreationLinks.map((link, index) => (
                <a
                  key={`${clubCreationForm.club.clubName}-${index}-${link}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-[#2563EB] text-sm underline underline-offset-2"
                >
                  {link}
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-sm">등록된 링크가 없습니다.</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-xs">첨부 개설 양식</p>
          <p className="mt-1 break-all text-gray-600 text-sm">
            {clubCreationForm.clubCreationForm}
          </p>
          <button
            type="button"
            className="mt-3 rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onDownloadCreationSubmissionForm}
            disabled={isDownloadingCreationSubmissionForm}
          >
            {isDownloadingCreationSubmissionForm
              ? "다운로드 중..."
              : "첨부 양식 다운로드"}
          </button>
        </div>
      </div>
    </div>
  );
}
