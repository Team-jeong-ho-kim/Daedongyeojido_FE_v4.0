"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export default function Home() {
  const images = [
    { id: "slide-1", src: "/mac.png" },
    { id: "slide-2", src: "/mac.png" },
    { id: "slide-3", src: "/mac.png" },
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );

  const heroId = useId();
  const descriptionId = useId();
  const featuresId = useId();
  const cardsId = useId();
  const registerId = useId();
  const announceId = useId();
  const applyId = useId();
  const calendarId = useId();

  const heroRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const getTransformValue = () => {
    // 각 이미지가 60% width를 차지하고, 간격을 더 줄여서 포커스 이미지를 중앙에
    return `translateX(calc(-${currentImageIndex * 60}% + 20%))`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3초마다 이미지 변경

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    const refs = [
      heroRef,
      descriptionRef,
      featuresRef,
      cardsRef,
      registerRef,
      announceRef,
      applyRef,
      calendarRef,
    ];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="bg-white relative size-full">
      {/* Header */}
      <div className="bg-white h-[70px] left-0 overflow-clip top-0 w-full">
        <div className="flex items-center justify-between px-4 h-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="대동여지도 로고"
              width={22}
              height={18}
              className="h-[18px] w-[22px]"
            />
            <p className="font-bold text-lg text-black">대동여지도</p>
          </div>
          <div className="flex items-center gap-8">
            <p className="text-[#4e5968] text-lg">동아리</p>
            <p className="text-[#4e5968] text-lg">공고</p>
            <p className="text-[#474747] text-lg">로그인</p>
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute h-[1781px] left-0 top-[70px] w-full bg-gradient-to-b from-transparent via-red-50/10 to-white" />

      {/* Hero Section */}
      <div
        ref={heroRef}
        id={heroId}
        className={`relative pt-[193px] pb-[50px] flex items-center justify-items-center flex-col gap-80 transition-all duration-1000 ease-out ${
          visibleSections.has(heroId)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex flex-col items-center px-4">
          <h1 className="text-[70px] font-bold leading-[110px] text-center text-black tracking-[-0.75px] mb-8">
            <span className="block">동아리의 모든 것</span>
            <span className="block">대동여지도에서 쉽고 간편하게</span>
          </h1>
          <button type="button" className="bg-[#f0e5e5] px-8 py-4 rounded-[20px] text-[#4a4444] font-bold text-[22px]">
            로그인 하기
          </button>
        </div>
        <div className="flex flex-col items-center gap-10 w-full px-4">
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[655px] flex items-center justify-center">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: getTransformValue(),
                width: `${images.length * 60}%`,
              }}
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative flex-shrink-0 flex items-center justify-center px-0.5"
                  style={{ width: "60%" }}
                >
                  <Image
                    src={image.src}
                    alt={`hero ${index + 1}`}
                    width={1080}
                    height={655}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    style={{
                      opacity: index === currentImageIndex ? 1 : 0.6,
                      transform:
                        index === currentImageIndex ? "scale(1)" : "scale(0.9)",
                      transition:
                        "opacity 0.7s ease-in-out, transform 0.7s ease-in-out",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Slide Indicators */}
          <div className="flex items-center gap-[5px] mb-32">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={`rounded-[100px] transition-all duration-300 cursor-pointer border-none ${
                  index === currentImageIndex
                    ? "bg-[#f45851] h-2.5 w-[25px]"
                    : "bg-[#c9c9c9] size-2.5 hover:bg-[#a0a0a0]"
                }`}
                onClick={() => setCurrentImageIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCurrentImageIndex(index);
                  }
                }}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>

          <div>
            <Image src="/arrow.png" alt="mac" width={61} height={19} />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div
        ref={descriptionRef}
        id={descriptionId}
        className={`bg-[#fbf9fa] py-[259px] relative transition-all duration-1000 ease-out ${
          visibleSections.has(descriptionId)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mx-auto px-4">
          <p className="text-[40px] font-bold leading-[70px] text-[#28191b] mb-8 whitespace-nowrap w-full">
            대덕소프트웨어마이스터고등학교의 전공동아리들을
            <br />
            한눈에 조회하고 한 곳에서 관리하세요.
            <br />
            <span className="text-[#ff4a50]">
              이제껏 경험 못 했던 쉽고 편리한 전공동아리 서비스,
            </span>
            <br />
            대동여지도와 함께라면 당신의 전공동아리가 새로워질 거예요.
          </p>
        </div>

        {/* Vector icon */}
      </div>

      {/* Features Title Section */}
      <div
        ref={featuresRef}
        id={featuresId}
        className={`pt-64 text-center transition-all duration-1000 ease-out ${
          visibleSections.has(featuresId)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-[85px] font-bold leading-normal text-center mb-8">
          <span className="text-[#28191b] block">전공동아리</span>
          <span className="text-[#ff4d62] block">관리의 모든 것</span>
          <span className="text-[#28191b] block">하나로 관리하다</span>
        </h2>
      </div>

      {/* Feature Cards Section */}
      <div
        ref={cardsRef}
        id={cardsId}
        className={`relative py-[200px] h-[900px] transition-all duration-1200 ease-out ${
          visibleSections.has(cardsId) ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative w-full flex justify-center">
          <div
            className={`absolute left-[calc(50%-595px)] top-12 transform rotate-[-6deg] transition-all duration-700 ease-out ${
              visibleSections.has(cardsId)
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-8"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <Image src="/card1.png" alt="동아리카드" width={295} height={396} />
          </div>
          <div
            className={`absolute left-[calc(50%-450px)] top-0 transform transition-all duration-700 ease-out ${
              visibleSections.has(cardsId)
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Image src="/card2.png" alt="지원 카드" width={436} height={501} />
          </div>
          <div
            className={`absolute left-[calc(50%-147px)] top-0 transition-all duration-700 ease-out ${
              visibleSections.has(cardsId)
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-8"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <Image src="/card3.png" alt="면접 카드" width={295} height={396} />
          </div>
          <div
            className={`absolute left-[calc(50%+70px)] top-16 transform rotate-[-5deg] transition-all duration-700 ease-out ${
              visibleSections.has(cardsId)
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <Image src="/card4.png" alt="회식 카드" width={360} height={442} />
          </div>
          <div
            className={`absolute left-[calc(50%+110px)] top-30 transform rotate-[-7deg] transition-all duration-700 ease-out ${
              visibleSections.has(cardsId)
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-8"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <Image src="/card4_.png" alt="회식 카드" width={233} height={294} />
          </div>
          <div
            className={`absolute left-[calc(50%+310px)] top-0 transform transition-all duration-700 ease-out ${
              visibleSections.has(cardsId)
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <Image src="/card5.png" alt="공지 카드" width={358} height={459} />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="py-[300px] max-w-7xl mx-auto px-4">
        <div
          ref={registerRef}
          id={registerId}
          className={`mb-[300px] transition-all duration-1000 ease-out ${
            visibleSections.has(registerId)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-[35px] font-bold text-[#ff4a50] mb-4">
            등록 · 생성
          </p>
          <h3 className="text-[70px] font-bold text-black leading-24 mb-28">
            <span className="block">동아리 관리,</span>
            <span className="block">등록부터 생성까지</span>
            <span className="block">간편하게</span>
          </h3>
          <div className="flex justify-center">
            <Image
              src="/mac2.png"
              alt="동아리 관리, 등록부터 생성까지 간편하게"
              width={1080}
              height={655}
            />
          </div>
          <p className="text-[30px] text-end font-semibold text-[#6c6768] leading-normal mt-40">
            <span className="block">클릭 한 번으로 전공 동아리를</span>
            <span className="block">쉽게 생성할 수 있어요.</span>
          </p>
        </div>

        <div
          ref={announceRef}
          id={announceId}
          className={`mb-[300px] relative transition-all duration-1000 ease-out ${
            visibleSections.has(announceId)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Image src="/question.png" alt="질문 로고" width={20} height={18} />
            <p className="text-[24px] font-bold text-[#ff4a50]">
              전공동아리 공고
            </p>
          </div>
          <h3 className="text-[55px] font-bold text-[#524d4e] leading-[72px] mb-8">
            <span className="block">여러 전공동아리 공고를</span>
            <span className="block">한 눈에 확인하세요</span>
          </h3>
          <p className="text-[30px] font-semibold text-[#6c6768] leading-normal">
            대덕SW고의 전공동아리 공고를
            <br />
            쉽고 빠르게 확인할 수 있어요
          </p>

          {/* Absolute positioned images */}
          <div className="absolute right-[100px] top-[-100px]">
            <Image
              src="/page1.png"
              alt="사이드 이미지 1"
              width={564}
              height={349}
            />
          </div>
          <div className="absolute right-[-150px] top-16">
            <Image
              src="/page2.png"
              alt="사이드 이미지 2"
              width={451}
              height={313}
            />
          </div>
        </div>

        <div
          ref={applyRef}
          id={applyId}
          className={`mb-[300px] flex gap-36 transition-all duration-1000 ease-out ${
            visibleSections.has(applyId)
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10"
          }`}
        >
          <div className="">
            <Image
              src="/page3.png"
              alt="사이드 이미지 1"
              width={655}
              height={488}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/article.png"
                alt="질문 로고"
                width={20}
                height={18}
              />
              <p className="text-[24px] font-bold text-[#ff4a50]">지원 관리</p>
            </div>
            <h3 className="text-[55px] font-bold text-[#524d4e] leading-[72px] mb-8 whitespace-nowrap">
              <span className="block">전공동아리 지원 내역을</span>
              <span className="block">한 눈에 확인해보세요.</span>
            </h3>
            <p className="text-[30px] font-semibold text-[#6c6768] leading-normal whitespace-nowrap">
              마이페이지에서 자신이 지원한
              <br />
              전공동아리를 쉽고 간편하게 확인할 수 있어요
            </p>
          </div>
        </div>

        <div
          ref={calendarRef}
          id={calendarId}
          className={`mb-[300px] relative h-[940px] transition-all duration-1000 ease-out ${
            visibleSections.has(calendarId)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="">
            <p className="text-[30px] font-bold text-[#ff4a50] mb-8">
              우리의 시간은 소중하니까
            </p>
            <h3 className="text-[80px] font-bold text-[#524d4e] leading-[84px] mb-8">
              <span className="block">복잡하고 귀찮은</span>
              <span className="block">일들과 작별해보세요</span>
            </h3>
            <p className="text-[30px] font-semibold text-[#6c6768] leading-normal">
              큐알 코드가 붙은 포스터, 동아리 정보들
              <br />
              면접 일정 관리, 공지, 합격 결과 알리기
              <br />
              <br />
              대동여지도와 함께라면 더이상 번거롭지 않아요
            </p>
          </div>
          <div className="absolute right-[-200px] top-0">
            <Image
              src="/calender.png"
              alt="달력 로고"
              width={767}
              height={940}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#303740] py-[50px] px-[220px]">
        <div className="flex items-center gap-4 text-[#bdbdbd]">
          <Image
            src="/logo.png"
            alt="대동여지도 로고"
            width={22}
            height={18}
            className="h-[18px] w-[22px]"
          />
          <p className="text-sm">|</p>
          <p className="text-sm font-bold">대동여지도</p>
          <p className="text-sm">|</p>
          <p className="text-sm font-bold">DaeDongYeoJiDo</p>
        </div>
        <div className="mt-8 text-sm text-[#bdbdbd] leading-normal">
          <p className="mb-0">
            대덕소프트웨어마이스터고등학교를 위한 전공동아리 관리 서비스
            대동여지도 | PM: 박태수
          </p>
          <p className="mb-0">
            FRONTEND: 지도현, 최민수 | BACKEND: 박태수, 채도훈 | DESIGN: 손희찬
          </p>
          <p>주소 : 대전광역시 유성구 가정북로 76</p>
        </div>
        <p className="mt-4 text-sm text-[#bdbdbd]">@DAEDONGYEOJIDO</p>

        <div className="mt-8 flex items-center justify-end">
          <button type="button" className="bg-[#5c6168] flex items-center gap-2 px-6 py-3 rounded-md">
            <Image
              src="/inquire.png"
              alt="문의 아이콘"
              width={16}
              height={16}
              className="w-4 h-4 opacity-70"
            />
            <p className="text-white text-sm">문의하기</p>
          </button>
        </div>
      </div>
    </div>
  );
}
