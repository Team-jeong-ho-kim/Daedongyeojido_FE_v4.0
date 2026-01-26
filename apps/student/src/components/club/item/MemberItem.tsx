import type { ClubMember } from "@/types";

interface MemberItemProps extends ClubMember {
  canDelete?: boolean;
  onDelete?: () => void;
}

export default function MemberItem({
  userName,
  majors,
  introduce,
  canDelete = false,
  onDelete,
}: MemberItemProps) {
  return (
    <article className="group relative z-0 h-[250px] w-full select-none overflow-visible rounded-[14px] shadow-sm transition-all duration-200 hover:z-50 md:h-[270px] md:rounded-[16px] lg:h-[285px] lg:w-[240px]">
      {/* 삭제 버튼 */}
      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2 right-2 z-10 rounded-full bg-white/80 p-1.5 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>삭제</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* 이미지 영역 */}
      <div className="h-[140px] w-full rounded-t-[14px] bg-[#3D5A4C] md:h-[155px] md:rounded-t-[16px] lg:h-[165px]" />

      {/* 정보 영역 */}
      <div className="flex flex-col gap-1.5 rounded-b-[14px] bg-gray-50 p-3 transition-shadow duration-200 group-hover:shadow-xl md:rounded-b-[16px] md:p-4">
        <h3 className="font-semibold text-[14px] text-gray-900 md:text-[15px]">
          {userName}
        </h3>
        <p className="mt-1 line-clamp-1 text-[12px] text-gray-600 leading-relaxed transition-all duration-200 group-hover:line-clamp-none md:text-[13px]">
          {introduce || "소개가 없습니다."}
        </p>
        <div className="flex max-h-7 flex-wrap gap-1 overflow-hidden text-[11px] text-gray-500 transition-all duration-200 group-hover:max-h-none md:text-[12px]">
          {majors && majors.length > 0 ? (
            majors.map((major) => (
              <span
                key={major}
                className="flex h-7 w-auto items-center rounded-[100px] border-[0.1px] px-[10px]"
              >
                # {major}
              </span>
            ))
          ) : (
            <span className="flex h-7 w-auto items-center rounded-[100px] border-[0.1px] px-[10px] text-gray-400">
              전공 정보 없음
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
