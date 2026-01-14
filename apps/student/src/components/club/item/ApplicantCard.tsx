import Image from "next/image";
import { useRouter } from "next/navigation";

interface Applicant {
  name: string;
  studentId: string;
  position: string;
  interviewDate: string;
  applicationId: string;
  announcementId: string;
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

  const handleClick = () => {
    if (onClick) {
      onClick(applicant);
    }
    router.push(
      `/announcements/${applicant.announcementId}/${applicant.applicationId}`,
    );
  };

  return (
    <button
      type="button"
      className="w-full cursor-pointer rounded-2xl bg-white p-6 text-left shadow-sm transition-shadow duration-200 hover:shadow-md"
      onClick={handleClick}
    >
      {/* 헤더 */}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-lg">{applicant.name}</h3>
        <Image
          src="/images/clubs/rightArrow.svg"
          alt="화살표"
          width={12}
          height={12}
        />
      </div>

      {/* 정보 섹션 */}
      <div className="flex items-center gap-6 text-sm">
        {/* 학번 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">학번 :</span>
          <span className="font-semibold text-gray-900">
            {applicant.studentId}
          </span>
        </div>

        {/* 지원 전공 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">지원 전공:</span>
          <span className="rounded-full border border-primary-500 px-3 py-1 font-medium text-primary-500 text-sm">
            {applicant.position}
          </span>
        </div>

        {/* 면접 일자 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">면접 일자 :</span>
          <span className="font-semibold text-gray-900">
            {applicant.interviewDate}
          </span>
        </div>
      </div>
    </button>
  );
}
