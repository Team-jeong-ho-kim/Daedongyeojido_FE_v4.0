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
  const MAX_VISIBLE_MAJORS = 2;
  const hasMoreMajors = majors && majors.length > MAX_VISIBLE_MAJORS;
  const visibleMajors = majors?.slice(0, MAX_VISIBLE_MAJORS);
  const remainingCount = majors ? majors.length - MAX_VISIBLE_MAJORS : 0;

  return (
    <article className="group relative z-0 h-[250px] w-full select-none overflow-visible rounded-[14px] shadow-sm transition-all duration-300 hover:z-50 hover:shadow-xl md:h-[270px] md:rounded-[16px] lg:h-[285px] lg:w-[240px]">
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
      <div className="relative h-[140px] w-full overflow-hidden rounded-t-[14px] bg-gray-200 md:h-[155px] md:rounded-t-[16px] lg:h-[165px]">
        <Image
          src={profileImage}
          alt={`${userName} 프로필`}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 240px"
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex h-[110px] flex-col gap-1.5 rounded-b-[14px] bg-gray-50 p-3 transition-shadow duration-200 group-hover:shadow-xl md:h-[115px] md:rounded-b-[16px] md:p-4 lg:h-[120px]">
        <h3 className="flex-shrink-0 font-semibold text-[14px] text-gray-900 md:text-[15px]">
          {userName}
        </h3>
        <p className="mt-1 line-clamp-2 flex-shrink-0 overflow-hidden text-[12px] text-gray-600 leading-relaxed md:text-[13px]">
          {introduction || "소개가 없습니다."}
        </p>
        <div className="relative flex min-h-7 flex-shrink-0 flex-wrap gap-1 overflow-visible text-[11px] text-gray-500 md:text-[12px]">
          {/* 기본 표시 (항상 보임) */}
          <div className="flex flex-wrap gap-1">
            {majors && majors.length > 0 ? (
              <>
                {visibleMajors?.map((major) => (
                  <span
                    key={major}
                    className="flex h-7 w-auto items-center rounded-[100px] border-[0.1px] px-[10px]"
                  >
                    # {major}
                  </span>
                ))}
                {hasMoreMajors && (
                  <span className="flex h-7 w-auto items-center rounded-[100px] border-[0.1px] border-gray-300 bg-gray-50 px-[10px] font-medium text-gray-500 text-xs transition-colors group-hover:border-primary-300 group-hover:bg-primary-50 group-hover:text-primary-600">
                    +{remainingCount}
                  </span>
                )}
              </>
            ) : (
              <span className="flex h-7 w-auto items-center rounded-[100px] border-[0.1px] px-[10px] text-gray-400">
                전공 정보 없음
              </span>
            )}
          </div>

          {/* 호버 시 전체 전공 표시 (팝업) */}
          {hasMoreMajors && (
            <div className="pointer-events-none absolute top-0 left-0 z-10 hidden w-full min-w-max flex-wrap gap-1.5 rounded-xl border border-gray-200 bg-white/95 p-3 opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out group-hover:flex group-hover:scale-100 group-hover:opacity-100 md:scale-95">
              {majors?.map((major) => (
                <span
                  key={major}
                  className="flex h-7 w-auto items-center rounded-full border border-primary-200 bg-primary-50 px-3 font-medium text-primary-600 text-xs shadow-sm"
                >
                  # {major}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
