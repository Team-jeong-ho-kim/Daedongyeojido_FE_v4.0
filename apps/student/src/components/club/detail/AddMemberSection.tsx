"use client";

interface AddMemberSectionProps {
  studentNumber: string;
  setStudentNumber: (value: string) => void;
  studentName: string;
  setStudentName: (value: string) => void;
  onAddMemberRequest: () => void;
}

export function AddMemberSection({
  studentNumber,
  setStudentNumber,
  studentName,
  setStudentName,
  onAddMemberRequest,
}: AddMemberSectionProps) {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <h3 className="mb-1 font-semibold text-[16px]">동아리 팀원 추가</h3>
        <p className="text-[13px] text-gray-500">
          학번으로 검색해서 동아리 팀원을 추가해주세요.
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="학번"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-[14px] placeholder:text-gray-300 focus:border-gray-400 focus:outline-none"
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="이름"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-[14px] placeholder:text-gray-300 focus:border-gray-400 focus:outline-none"
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <button
          type="button"
          onClick={onAddMemberRequest}
          className="whitespace-nowrap rounded-lg bg-red-500 px-6 py-2.5 text-[14px] text-white hover:bg-red-600"
        >
          팀원 추가 요청
        </button>
      </div>
    </div>
  );
}
