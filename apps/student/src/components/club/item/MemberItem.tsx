import Image from "next/image";
import type { ClubMember } from "@/types";

interface MemberItemProps extends ClubMember {
  canDelete?: boolean;
  onDelete?: () => void;
}

export default function MemberItem({
  userName,
  majors,
  introduction,
  profileImage,
  canDelete = false,
  onDelete,
}: MemberItemProps) {
  return (
    <article className="group relative flex h-full min-w-0 w-full select-none flex-col overflow-hidden rounded-[14px] bg-white shadow-sm transition-all duration-300 hover:shadow-lg md:rounded-[16px]">
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
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
        <Image
          src={profileImage}
          alt={`${userName} 프로필`}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) calc(50vw - 32px), (max-width: 1024px) calc(33vw - 32px), 240px"
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-1 flex-col gap-2 bg-gray-50 p-3 md:p-4">
        <h3 className="min-w-0 font-semibold text-[14px] text-gray-900 md:text-[15px]">
          {userName}
        </h3>
        <p className="line-clamp-2 min-h-[2.75rem] overflow-hidden text-[12px] text-gray-600 leading-relaxed md:min-h-[3rem] md:text-[13px]">
          {introduction || "소개가 없습니다."}
        </p>
        <div className="mt-auto flex min-h-7 flex-wrap gap-1.5 text-[11px] text-gray-500 md:text-[12px]">
          {majors && majors.length > 0 ? (
            majors.map((major) => (
              <span
                key={major}
                className="inline-flex min-h-7 items-center rounded-full border border-gray-300 px-2.5 py-1 font-medium leading-none md:px-3"
              >
                #{major}
              </span>
            ))
          ) : (
            <span className="inline-flex min-h-7 items-center rounded-full border border-gray-300 px-2.5 py-1 text-gray-400 md:px-3">
              전공 정보 없음
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
