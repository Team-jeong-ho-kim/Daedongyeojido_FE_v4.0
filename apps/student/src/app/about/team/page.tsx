import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "팀원 소개",
  description:
    "대동여지도를 만드는 사람들을 소개합니다. PM, 프론트엔드, 백엔드, 디자이너로 구성된 전문가 팀이 함께 만들어가는 대동여지도입니다.",
  openGraph: {
    title: "팀원 소개 | 대동여지도",
    description:
      "대동여지도를 만드는 사람들. PM, 프론트엔드, 백엔드, 디자이너로 구성된 전문가 팀",
  },
};

const teamMembers = [
  {
    roles: ["PM", "BACKEND"],
    name: "박태수",
    position: "Project Manager & Backend Developer",
    github: "https://github.com/parktaesu123",
    description:
      "프로젝트의 전체적인 방향성을 설정하고, 안정적인 서버 아키텍처를 설계합니다",
  },
  {
    roles: ["FRONTEND"],
    name: "최민수",
    position: "Frontend Developer",
    github: "https://github.com/minsu0707",
    description: "깔끔하고 효율적인 코드를 작성하는 프론트엔드 개발자",
  },
  {
    roles: ["FRONTEND"],
    name: "지도현",
    position: "Frontend Developer",
    github: "https://github.com/jidohyun",
    description: "사용자 경험을 최우선으로 생각하는 프론트엔드 개발자",
  },
  {
    roles: ["BACKEND"],
    name: "채도훈",
    position: "Backend Developer",
    github: "https://github.com/coehgns",
    description: "효율적인 데이터 처리와 API 설계를 담당합니다",
  },
  {
    roles: ["DESIGN"],
    name: "손희찬",
    position: "Designer",
    github: "https://github.com/sonheechan",
    description: "사용자 중심의 직관적인 디자인을 만들어갑니다",
  },
];

export default function TeamPage() {
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
              대동여지도를 만드는 사람들
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              다양한 분야의 전문가들이 함께 만들어가는 대동여지도
            </p>
          </div>
          <div className="relative h-[200px] w-full md:h-[250px] md:w-[300px] md:shrink-0">
            <Image
              src="/images/main/blue.png"
              alt="대동여지도 팀원"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* 팀원 소개 */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <a
              key={`${member.name}-${index}`}
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary-300 hover:bg-gray-50 hover:shadow-xl"
            >
              {/* 역할과 깃허브 아이콘 */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {member.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-primary-50 px-3 py-1 font-medium text-primary-700 text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* 깃허브 아이콘 표시 */}
                <div className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:border-primary-500 group-hover:bg-primary-500 group-hover:text-white group-hover:opacity-100 group-hover:shadow-md">
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="GitHub"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
              </div>

              {/* 이름 - 호버 시 강조 */}
              <h3 className="mb-1 font-bold text-gray-900 text-xl transition-all duration-300 group-hover:text-primary-600">
                {member.name}
              </h3>
              <p className="mb-3 text-gray-600 text-sm">{member.position}</p>

              {/* 설명 */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {member.description}
              </p>

              {/* 하단 강조선 - 호버 시 표시 */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>
          ))}
        </div>

        {/* 팀 문화 */}
        <div className="mt-16 md:mt-24">
          <h2 className="mb-8 text-center font-bold text-2xl text-gray-900 md:text-3xl">
            우리의 협업 문화
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="열린 소통"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900 text-lg">
                열린 소통
              </h3>
              <p className="text-gray-600 text-sm">
                서로의 의견을 존중하고 자유롭게 의견을 나눕니다
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="목표 지향"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900 text-lg">
                목표 지향
              </h3>
              <p className="text-gray-600 text-sm">
                명확한 목표를 세우고 함께 달성해 나갑니다
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="지속 성장"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900 text-lg">
                지속 성장
              </h3>
              <p className="text-gray-600 text-sm">
                끊임없이 배우고 발전하는 것을 추구합니다
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-center text-white md:mt-24 md:p-12">
          <h3 className="mb-3 font-bold text-2xl md:text-3xl">
            함께 만들어가는 대동여지도
          </h3>
          <p className="text-primary-50 md:text-lg">
            여러분의 소중한 피드백과 의견이 대동여지도를 더욱 발전시킵니다
          </p>
        </div>
      </div>
    </main>
  );
}
