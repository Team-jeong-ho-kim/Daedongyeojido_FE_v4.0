interface MemberItemProps {
  userName: string;
  majors: string[];
  introduction: string;
  profileImage: string;
}

export default function MemberItem({
  userName,
  majors,
  introduction,
  profileImage,
}: MemberItemProps) {
  const maxVisibleMajors = 2;
  const hasMoreMajors = majors.length > maxVisibleMajors;
  const visibleMajors = majors.slice(0, maxVisibleMajors);
  const remainingCount = majors.length - maxVisibleMajors;

  return (
    <article className="group relative z-0 h-[250px] w-full select-none overflow-visible rounded-[14px] shadow-sm transition-all duration-300 hover:z-50 hover:shadow-xl md:h-[270px] md:rounded-[16px] lg:h-[285px] lg:w-[240px]">
      <div className="relative h-[140px] w-full overflow-hidden rounded-t-[14px] bg-gray-200 md:h-[155px] md:rounded-t-[16px] lg:h-[165px]">
        <img
          src={profileImage}
          alt={`${userName} 프로필`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex h-[110px] flex-col gap-1.5 rounded-b-[14px] bg-gray-50 p-3 transition-shadow duration-200 group-hover:shadow-xl md:h-[115px] md:rounded-b-[16px] md:p-4 lg:h-[120px]">
        <h3 className="flex-shrink-0 font-semibold text-[14px] text-gray-900 md:text-[15px]">
          {userName}
        </h3>
        <p className="mt-1 line-clamp-2 flex-shrink-0 overflow-hidden text-[12px] text-gray-600 leading-relaxed md:text-[13px]">
          {introduction || "소개가 없습니다."}
        </p>
        <div className="relative flex min-h-7 flex-shrink-0 flex-wrap gap-1 overflow-visible text-[11px] text-gray-500 md:text-[12px]">
          <div className="flex flex-wrap gap-1">
            {majors.length > 0 ? (
              <>
                {visibleMajors.map((major) => (
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

          {hasMoreMajors && (
            <div className="pointer-events-none absolute top-0 left-0 z-10 hidden w-full min-w-max flex-wrap gap-1.5 rounded-xl border border-gray-200 bg-white/95 p-3 opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out group-hover:flex group-hover:scale-100 group-hover:opacity-100 md:scale-95">
              {majors.map((major) => (
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
