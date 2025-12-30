"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#303740] px-4 py-8 md:px-12 md:py-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 text-[#bdbdbd]">
          <Image
            src="/images/icons/logo.png"
            alt="대동여지도"
            width={22}
            height={18}
          />
          <span className="text-sm">|</span>
          <span className="font-bold text-sm">대동여지도</span>
          <span className="text-sm">|</span>
          <span className="font-bold text-sm">DaeDongYeoJiDo</span>
        </div>
        <div className="mt-6 text-[#bdbdbd] text-xs leading-relaxed md:text-sm">
          <p>
            대덕소프트웨어마이스터고등학교를 위한 전공동아리 관리 서비스
            대동여지도 | PM: 박태수
          </p>
          <p>
            FRONTEND: 지도현, 최민수 | BACKEND: 박태수, 채도훈 | DESIGN: 손희찬
          </p>
          <p>주소 : 대전광역시 유성구 가정북로 76</p>
        </div>
        <p className="mt-4 text-[#bdbdbd] text-xs md:text-sm">
          @DAEDONGYEOJIDO
        </p>
      </div>
    </footer>
  );
}
