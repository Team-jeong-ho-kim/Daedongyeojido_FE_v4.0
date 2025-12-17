import type { ClubMember } from "@/types";

/**
 * Render a styled member card displaying a member's name, introduction, and majors.
 *
 * @param userName - Member's display name shown as the card heading
 * @param majors - Array of major names rendered as hashtagged pill tags
 * @param introduce - Short introduction text shown beneath the name; truncated by default and expanded on hover
 * @returns A JSX element representing a styled member card containing the name, introduction, and major tags
 */
export default function MemberItem({
  userName,
  majors,
  introduce,
}: ClubMember) {
  return (
    <article className="group relative z-0 flex w-full select-none flex-col overflow-hidden rounded-[14px] shadow-sm transition-all duration-200 hover:z-50 hover:shadow-lg md:rounded-[16px] lg:w-[240px]">
      {/* 이미지 영역 */}
      <div className="h-[140px] w-full bg-[#3D5A4C] md:h-[155px] lg:h-[165px]" />

      {/* 정보 영역 */}
      <div className="flex flex-col gap-1.5 bg-gray-50 p-3 md:p-4">
        <h3 className="font-semibold text-[14px] text-gray-900 md:text-[15px]">
          {userName}
        </h3>
        <p className="mt-1 line-clamp-1 text-[12px] text-gray-600 leading-relaxed transition-all duration-200 group-hover:line-clamp-none md:text-[13px]">
          {introduce}
        </p>
        <div className="flex max-h-7 flex-wrap gap-1 overflow-hidden text-[11px] text-gray-500 transition-all duration-200 group-hover:max-h-none md:text-[12px]">
          {majors.map((major) => (
            <span
              key={major}
              className="flex h-7 w-auto items-center rounded-[100px] border-[0.1px] px-[10px]"
            >
              # {major}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}