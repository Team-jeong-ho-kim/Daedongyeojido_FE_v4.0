import Image from "next/image";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16 lg:py-24">
        {/* 메인으로 돌아가기 버튼 */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="뒤로 가기"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          메인으로 돌아가기
        </Link>

        {/* 헤더와 이미지 */}
        <div className="mb-16 flex flex-col items-start gap-8 md:mb-24 md:flex-row md:items-center md:gap-12">
          <div className="flex-1">
            <h1 className="font-bold text-3xl text-gray-900 md:text-4xl lg:text-5xl">
              대동여지도 기능
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              동아리 관리의 모든 것을 한 곳에서
            </p>
          </div>
          <div className="relative h-[200px] w-full md:h-[250px] md:w-[300px] md:shrink-0">
            <Image
              src="/images/main/red.png"
              alt="대동여지도 기능"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* 기능 설명 */}
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
            <div className="mb-3 inline-flex items-center justify-center rounded-full bg-primary-50 px-4 py-2">
              <span className="font-semibold text-primary-600 text-sm">
                동아리 생성 및 관리
              </span>
            </div>
            <h3 className="mb-3 font-bold text-gray-900 text-xl">
              클릭 한 번으로 간편하게
            </h3>
            <p className="text-gray-600 leading-relaxed">
              전공 동아리를 쉽게 생성하고, 멤버 관리부터 활동 내역까지 한 곳에서
              관리할 수 있어요. 복잡한 과정 없이 직관적인 인터페이스로 모든 것을
              처리할 수 있습니다.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
            <div className="mb-3 inline-flex items-center justify-center rounded-full bg-primary-50 px-4 py-2">
              <span className="font-semibold text-primary-600 text-sm">
                공고 및 모집
              </span>
            </div>
            <h3 className="mb-3 font-bold text-gray-900 text-xl">
              효율적인 지원자 관리
            </h3>
            <p className="text-gray-600 leading-relaxed">
              동아리 모집 공고를 쉽게 작성하고, 지원자 관리와 면접 일정을
              효율적으로 관리할 수 있어요. 더 이상 수기로 관리할 필요가
              없습니다.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
            <div className="mb-3 inline-flex items-center justify-center rounded-full bg-primary-50 px-4 py-2">
              <span className="font-semibold text-primary-600 text-sm">
                통계 및 분석
              </span>
            </div>
            <h3 className="mb-3 font-bold text-gray-900 text-xl">
              데이터 기반 운영
            </h3>
            <p className="text-gray-600 leading-relaxed">
              동아리 활동 현황과 지원자 통계를 한눈에 확인하고, 데이터 기반으로
              동아리를 운영할 수 있어요. 더 나은 의사결정을 내릴 수 있습니다.
            </p>
          </div>
        </div>

        {/* 추가 기능 */}
        <div className="mt-16 md:mt-24">
          <h2 className="mb-8 text-center font-bold text-2xl text-gray-900 md:text-3xl">
            더 많은 기능들
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-2 font-bold text-gray-900 text-lg">
                실시간 알림
              </h3>
              <p className="text-gray-600 text-sm">
                중요한 소식을 놓치지 않도록 실시간으로 알려드려요
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-2 font-bold text-gray-900 text-lg">
                지원서 폼 생성
              </h3>
              <p className="text-gray-600 text-sm">
                맞춤형 지원서 양식을 손쉽게 만들고 관리할 수 있어요
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-2 font-bold text-gray-900 text-lg">대시보드</h3>
              <p className="text-gray-600 text-sm">
                동아리 현황을 한눈에 파악할 수 있는 대시보드를 제공해요
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
