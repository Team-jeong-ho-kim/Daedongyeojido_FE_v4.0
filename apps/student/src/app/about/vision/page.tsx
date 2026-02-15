import Image from "next/image";
import Link from "next/link";

export default function VisionPage() {
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
              대동여지도 비전
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              더 나은 동아리 문화를 위한 우리의 꿈
            </p>
          </div>
          <div className="relative h-[200px] w-full md:h-[250px] md:w-[300px] md:shrink-0">
            <Image
              src="/images/main/green.png"
              alt="대동여지도 비전"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* 메인 비전 */}
        <div className="mb-16 text-center md:mb-24">
          <h2 className="mb-6 font-bold text-2xl text-gray-900 md:text-3xl lg:text-4xl">
            동아리 문화의 혁신
          </h2>
          <p className="mx-auto max-w-3xl text-gray-700 text-lg leading-relaxed md:text-xl">
            대동여지도는 단순한 관리 시스템을 넘어, 학교 동아리 문화 전체를
            혁신하는 것을 목표로 합니다. 모든 학생이 쉽게 동아리를 찾고 참여할
            수 있는 환경을 만들어갑니다.
          </p>
        </div>

        {/* 비전 카드 */}
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md md:p-10">
            <h3 className="mb-4 font-bold text-gray-900 text-xl md:text-2xl">
              지속 가능한 발전
            </h3>
            <p className="text-gray-700 leading-relaxed md:text-lg">
              학생들의 피드백을 적극 반영하여 끊임없이 개선하고, 더 나은
              서비스를 제공합니다. 현재에 안주하지 않고 항상 더 나은 방향을
              찾아갑니다.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md md:p-10">
            <h3 className="mb-4 font-bold text-gray-900 text-xl md:text-2xl">
              확장 가능성
            </h3>
            <p className="text-gray-700 leading-relaxed md:text-lg">
              대덕소프트웨어마이스터고를 넘어 다른 학교로도 서비스를 확장하여 더
              많은 학생들에게 도움을 줍니다. 우리의 경험이 다른 학교의 발전에도
              기여하기를 바랍니다.
            </p>
          </div>
        </div>

        {/* 핵심 가치 */}
        <div className="mb-16 md:mb-24">
          <h2 className="mb-10 text-center font-bold text-2xl text-gray-900 md:text-3xl">
            우리의 핵심 가치
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border-2 border-primary-200 bg-white p-6 transition-all hover:border-primary-400 hover:shadow-lg">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary-100">
                <span className="font-bold text-primary-600 text-xl">1</span>
              </div>
              <h4 className="mb-3 font-bold text-gray-900 text-lg">
                사용자 중심
              </h4>
              <p className="text-gray-600 leading-relaxed">
                모든 기능과 디자인은 사용자의 편의를 최우선으로 고려합니다
              </p>
            </div>
            <div className="rounded-2xl border-2 border-primary-200 bg-white p-6 transition-all hover:border-primary-400 hover:shadow-lg">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary-100">
                <span className="font-bold text-primary-600 text-xl">2</span>
              </div>
              <h4 className="mb-3 font-bold text-gray-900 text-lg">혁신</h4>
              <p className="text-gray-600 leading-relaxed">
                기존의 방식에 얽매이지 않고 새로운 시도를 두려워하지 않습니다
              </p>
            </div>
            <div className="rounded-2xl border-2 border-primary-200 bg-white p-6 transition-all hover:border-primary-400 hover:shadow-lg">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary-100">
                <span className="font-bold text-primary-600 text-xl">3</span>
              </div>
              <h4 className="mb-3 font-bold text-gray-900 text-lg">협력</h4>
              <p className="text-gray-600 leading-relaxed">
                학생, 선생님, 모든 구성원과 함께 만들어가는 플랫폼입니다
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 p-10 text-center text-white md:p-16">
          <h3 className="mb-4 font-bold text-2xl md:text-3xl">
            "함께 만들어가는 동아리 문화"
          </h3>
          <p className="mb-6 text-lg text-primary-50 md:text-xl">
            대동여지도는 학생들이 직접 참여하고 발전시키는 플랫폼입니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/clubs"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-primary-600 transition-transform hover:scale-105"
            >
              동아리 둘러보기
            </Link>
            <Link
              href="/announcements"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-primary-600"
            >
              공고 확인하기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
