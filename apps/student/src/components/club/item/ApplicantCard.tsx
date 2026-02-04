import Image from "next/image";
import { useRouter } from "next/navigation";
import { Chip } from "../../common/Chip";

interface Applicant {
  submissionId?: number;
  userName?: string;
  classNumber?: string;
  major?: string[] | string;
  // 하위 호환성 유지
  name?: string;
  studentId?: string;
  position?: string;
  interviewDate?: string;
  applicationId?: string;
  announcementId?: string;
}

interface ApplicantCardProps {
  applicant: Applicant;
  onClick?: (applicant: Applicant) => void;
}

export default function ApplicantCard({
  applicant,
  onClick,
}: ApplicantCardProps) {
  const router = useRouter();

  // 새 형식과 기존 형식 모두 지원
  const displayName = applicant.userName || applicant.name || "이름 없음";
  const displayStudentId =
    applicant.classNumber || applicant.studentId || "학번 없음";
  const displayMajor = applicant.major
    ? Array.isArray(applicant.major)
      ? applicant.major.join(", ")
      : String(applicant.major)
    : applicant.position || "전공 없음";
  const displayInterviewDate = applicant.interviewDate || "-";
  const hasNavigationData =
    applicant.submissionId ||
    (applicant.announcementId && applicant.applicationId);

  const handleClick = () => {
    if (onClick) {
      onClick(applicant);
    }
    // 새 형식: submissionId로 이동
    if (applicant.submissionId) {
      router.push(`/clubs/submissions/${applicant.submissionId}`);
    }
    // 기존 형식: announcementId/applicationId로 이동
    else if (applicant.announcementId && applicant.applicationId) {
      router.push(
        `/announcements/${applicant.announcementId}/${applicant.applicationId}`,
      );
    }
  };

  return (
    <button
      type="button"
      className="w-full cursor-pointer rounded-2xl bg-white p-6 text-left shadow-sm transition-shadow duration-200 hover:shadow-md"
      onClick={handleClick}
    >
      {/* 헤더 */}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-lg">{displayName}</h3>
        {hasNavigationData && (
          <Image
            src="/images/clubs/rightArrow.svg"
            alt="화살표"
            width={12}
            height={12}
          />
        )}
      </div>

      {/* 정보 섹션 */}
      <div className="flex items-center gap-6 text-sm">
        {/* 학번 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">학번 :</span>
          <span className="font-semibold text-gray-900">
            {displayStudentId}
          </span>
        </div>

        {/* 지원 전공 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">지원 전공:</span>
          <Chip active>{displayMajor}</Chip>
        </div>

        {/* 면접 일자 (있을 때만 표시) */}
        {applicant.interviewDate && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">면접 일자 :</span>
            <span className="font-semibold text-gray-900">
              {displayInterviewDate}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
