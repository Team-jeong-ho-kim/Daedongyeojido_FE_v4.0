import Chip from "../common/Chip";

interface InterviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  applicant: {
    name: string;
    studentId: string;
    major: string;
  };
  interview: {
    date: string;
    time: string;
    location: string;
  };
}

export default function InterviewDetailModal({
  isOpen,
  onClose,
  onComplete,
  applicant,
  interview,
}: InterviewDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-[650px] rounded-3xl bg-white p-8 shadow-2xl">
        {/* 제목 */}
        <h2 className="mb-8 text-gray-700 text-xl">면접 일정 상세 조회</h2>

        {/* 프로필 */}
        <div className="mb-6">
          <p className="mb-3 text-gray-700 text-sm">프로필</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-900">
              이름 : <span className="font-semibold">{applicant.name}</span>
            </span>
            <span className="text-gray-900">
              학번 : <span className="font-semibold">{applicant.studentId}</span>
            </span>
            <span className="text-gray-900">지원 전공:</span>
            <Chip active>{applicant.major}</Chip>
          </div>
        </div>

        {/* 면접 일자 */}
        <div className="mb-6">
          <p className="mb-2 text-gray-700 text-sm">면접 일자</p>
          <p className="text-gray-900 text-lg">{interview.date}</p>
        </div>

        {/* 면접 시간 */}
        <div className="mb-6">
          <p className="mb-2 text-gray-700 text-sm">면접 시간</p>
          <p className="text-gray-900 text-lg">{interview.time}</p>
        </div>

        {/* 면접 장소 */}
        <div className="mb-8">
          <p className="mb-2 text-gray-700 text-sm">면접 장소</p>
          <p className="text-gray-900 text-lg">{interview.location}</p>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-400 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-500"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="flex-1 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600"
          >
            면접완료
          </button>
        </div>
      </div>
    </div>
  );
}
