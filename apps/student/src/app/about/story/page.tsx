import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "대동여지도의 탄생",
  description:
    "대동여지도가 탄생한 배경과 스토리를 소개합니다. 비효율적인 동아리 관리 문제를 발견하고, 학생들이 직접 해결책을 만들어 디지털 혁신을 이루어낸 여정입니다.",
  keywords: ["대동여지도 스토리", "동아리 문화 혁신", "학생 개발", "디지털화"],
  openGraph: {
    title: "대동여지도의 탄생 | 대동여지도",
    description: "비효율적인 동아리 관리를 혁신한 대동여지도의 탄생 스토리",
  },
};

export default function StoryPage() {
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
              대동여지도의 탄생
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              더 나은 동아리 문화를 위한 여정
            </p>
          </div>
          <div className="relative h-[200px] w-full md:h-[250px] md:w-[300px] md:shrink-0">
            <Image
              src="/images/main/yellow.png"
              alt="대동여지도의 탄생"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* 타임라인 */}
        <div className="mx-auto max-w-4xl space-y-8 md:space-y-12">
          {/* Step 1 */}
          <div className="relative flex gap-6 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary-500 font-bold text-white md:size-16">
                1
              </div>
              <div className="mt-2 h-full w-0.5 bg-gray-200" />
            </div>
            <div className="flex-1 pb-8">
              <h3 className="mb-3 font-bold text-gray-900 text-xl md:text-2xl">
                문제 발견
              </h3>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <p className="text-gray-700 leading-relaxed md:text-lg">
                  대덕소프트웨어마이스터고등학교의 전공동아리 관리는 복잡하고
                  번거로웠습니다. 포스터를 붙이고, QR 코드를 만들고, 지원서를
                  수기로 관리하는 과정이 비효율적이었죠. 동아리 부원들과
                  지원자들 모두 불편함을 느꼈고, 더 나은 시스템이 필요했습니다.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600 text-sm">
                    비효율적
                  </span>
                  <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600 text-sm">
                    번거로움
                  </span>
                  <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600 text-sm">
                    수기관리
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex gap-6 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary-500 font-bold text-white md:size-16">
                2
              </div>
              <div className="mt-2 h-full w-0.5 bg-gray-200" />
            </div>
            <div className="flex-1 pb-8">
              <h3 className="mb-3 font-bold text-gray-900 text-xl md:text-2xl">
                해결책 모색
              </h3>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <p className="text-gray-700 leading-relaxed md:text-lg">
                  학생들이 직접 개발한 대동여지도는 이러한 불편함을 해소하기
                  위해 탄생했습니다. 동아리 생성부터 모집, 관리까지 모든 과정을
                  디지털화하여 누구나 쉽게 사용할 수 있도록 만들었어요. 현장의
                  목소리를 직접 듣고, 실제로 필요한 기능들을 우선적으로
                  개발했습니다.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-medium text-blue-600 text-sm">
                    디지털화
                  </span>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-medium text-blue-600 text-sm">
                    사용자중심
                  </span>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-medium text-blue-600 text-sm">
                    혁신
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex gap-6 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary-500 font-bold text-white md:size-16">
                3
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-3 font-bold text-gray-900 text-xl md:text-2xl">
                지속적인 발전
              </h3>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <p className="text-gray-700 leading-relaxed md:text-lg">
                  현재도 학생들의 피드백을 반영하여 지속적으로 개선하고
                  있습니다. 대동여지도는 단순한 관리 시스템을 넘어, 학교 동아리
                  문화를 혁신하는 플랫폼으로 성장하고 있어요. 앞으로도 더 많은
                  기능과 개선사항을 통해 최고의 동아리 관리 플랫폼으로
                  발전해나갈 것입니다.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 font-medium text-green-600 text-sm">
                    지속성장
                  </span>
                  <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 font-medium text-green-600 text-sm">
                    사용자피드백
                  </span>
                  <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 font-medium text-green-600 text-sm">
                    문화혁신
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
