"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export default function Home() {
  const images = [
    { id: "slide-1", src: "/images/landing/mac2.png" },
    { id: "slide-2", src: "/images/landing/mac2.png" },
    { id: "slide-3", src: "/images/landing/mac2.png" },
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
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
    for (const ref of refs) {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    return () => {
      for (const ref of refs) {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    };
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute top-[70px] left-0 h-[1000px] w-full bg-gradient-to-b from-transparent via-red-50/10 to-white md:h-[1500px]" />

      {/* Hero Section */}
      <section
        ref={heroRef}
        id={heroId}
        className={`relative flex flex-col items-center gap-12 px-4 pt-24 pb-8 transition-all duration-1000 ease-out md:gap-20 md:pt-32 lg:pt-40 ${
          visibleSections.has(heroId)
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-6 font-bold text-3xl text-black leading-tight tracking-tight md:mb-8 md:text-5xl md:leading-tight lg:text-6xl">
            <span className="block">동아리의 모든 것</span>
            <span className="block">대동여지도에서 쉽고 간편하게</span>
          </h1>
          <Link
            href="/login"
            className="rounded-2xl bg-[#f0e5e5] px-6 py-3 font-bold text-[#4a4444] text-base transition-colors hover:bg-[#e5d5d5] md:px-8 md:py-4 md:text-lg"
          >
            로그인 하기
          </Link>
        </div>

        {/* Hero Image Carousel */}
        <div className="w-full max-w-5xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            {images.map((image, index) => (
              <Image
                key={image.id}
                src={image.src}
                alt={`hero ${index + 1}`}
                fill
                className={`object-contain transition-opacity duration-700 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Indicators */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={`cursor-pointer rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "h-2 w-5 bg-[#f45851]"
                    : "size-2 bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>

        <Image
          src="/images/landing/arrow.png"
          alt="scroll"
          width={40}
          height={12}
          className="mt-4 animate-bounce opacity-50"
        />
      </section>

      {/* Description Section */}
      <section
        ref={descriptionRef}
        id={descriptionId}
        className={`bg-[#fbf9fa] px-4 py-16 transition-all duration-1000 ease-out md:py-24 lg:py-32 ${
          visibleSections.has(descriptionId)
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-bold text-[#28191b] text-lg leading-relaxed md:text-2xl md:leading-relaxed lg:text-3xl lg:leading-relaxed">
            대덕소프트웨어마이스터고등학교의
            <br className="sm:hidden" /> 전공동아리들을
            <br />
            한눈에 조회하고 한 곳에서 관리하세요.
            <br />
            <span className="text-[#ff4a50]">
              이제껏 경험 못 했던 쉽고 편리한
              <br className="sm:hidden" /> 전공동아리 서비스,
            </span>
            <br />
            대동여지도와 함께라면
            <br className="sm:hidden" /> 당신의 전공동아리가 새로워질 거예요.
          </p>
        </div>
      </section>

      {/* Features Title Section */}
      <section
        ref={featuresRef}
        id={featuresId}
        className={`px-4 py-16 text-center transition-all duration-1000 ease-out md:py-24 lg:py-32 ${
          visibleSections.has(featuresId)
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="font-bold text-4xl leading-tight md:text-5xl lg:text-6xl">
          <span className="block text-[#28191b]">전공동아리</span>
          <span className="block text-[#ff4d62]">관리의 모든 것</span>
          <span className="block text-[#28191b]">하나로 관리하다</span>
        </h2>
      </section>

      {/* Feature Cards Section - Hidden on mobile */}
      <section
        ref={cardsRef}
        id={cardsId}
        className={`relative hidden py-12 transition-all duration-1000 ease-out lg:block lg:h-[600px] lg:py-16 ${
          visibleSections.has(cardsId) ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative mx-auto flex h-full max-w-6xl items-center justify-center">
          <div
            className={`absolute top-8 left-[5%] rotate-[-6deg] transition-all duration-700 ${
              visibleSections.has(cardsId)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <Image
              src="/images/landing/card1.png"
              alt="동아리카드"
              width={180}
              height={240}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div
            className={`absolute top-0 left-[18%] transition-all duration-700 ${
              visibleSections.has(cardsId)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Image
              src="/images/landing/card2.png"
              alt="지원 카드"
              width={260}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div
            className={`absolute top-4 left-[38%] transition-all duration-700 ${
              visibleSections.has(cardsId)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <Image
              src="/images/landing/card3.png"
              alt="면접 카드"
              width={180}
              height={240}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div
            className={`absolute top-12 left-[55%] rotate-[-5deg] transition-all duration-700 ${
              visibleSections.has(cardsId)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <Image
              src="/images/landing/card4.png"
              alt="회식 카드"
              width={220}
              height={270}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div
            className={`absolute top-0 left-[75%] transition-all duration-700 ${
              visibleSections.has(cardsId)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <Image
              src="/images/landing/card5.png"
              alt="공지 카드"
              width={220}
              height={280}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Mobile Cards - Horizontal scroll */}
      <section className="px-4 py-8 lg:hidden">
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
          {[
            { src: "/images/landing/card1.png", alt: "동아리카드" },
            { src: "/images/landing/card2.png", alt: "지원 카드" },
            { src: "/images/landing/card3.png", alt: "면접 카드" },
            { src: "/images/landing/card4.png", alt: "회식 카드" },
            { src: "/images/landing/card5.png", alt: "공지 카드" },
          ].map((card) => (
            <div key={card.alt} className="flex-shrink-0">
              <Image
                src={card.src}
                alt={card.alt}
                width={150}
                height={200}
                className="rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* Register Section */}
        <section
          ref={registerRef}
          id={registerId}
          className={`mb-20 transition-all duration-1000 ease-out md:mb-32 ${
            visibleSections.has(registerId)
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <p className="mb-2 font-bold text-[#ff4a50] text-xl md:mb-4 md:text-2xl">
            등록 · 생성
          </p>
          <h3 className="mb-8 font-bold text-3xl text-black leading-tight md:mb-12 md:text-4xl lg:text-5xl">
            <span className="block">동아리 관리,</span>
            <span className="block">등록부터 생성까지</span>
            <span className="block">간편하게</span>
          </h3>
          <div className="flex justify-center">
            <Image
              src="/images/landing/mac2.png"
              alt="동아리 관리 화면"
              width={900}
              height={545}
              className="w-full max-w-3xl rounded-lg"
            />
          </div>
          <p className="mt-8 text-end font-medium text-[#6c6768] text-base md:mt-12 md:text-xl">
            <span className="block">클릭 한 번으로 전공 동아리를</span>
            <span className="block">쉽게 생성할 수 있어요.</span>
          </p>
        </section>

        {/* Announce Section */}
        <section
          ref={announceRef}
          id={announceId}
          className={`mb-20 transition-all duration-1000 ease-out md:mb-32 ${
            visibleSections.has(announceId)
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-2 flex items-center gap-2 md:mb-4">
                <Image
                  src="/images/icons/question.png"
                  alt=""
                  width={18}
                  height={16}
                />
                <p className="font-bold text-[#ff4a50] text-lg md:text-xl">
                  전공동아리 공고
                </p>
              </div>
              <h3 className="mb-4 font-bold text-2xl text-[#524d4e] leading-tight md:mb-6 md:text-3xl lg:text-4xl">
                <span className="block">여러 전공동아리 공고를</span>
                <span className="block">한 눈에 확인하세요</span>
              </h3>
              <p className="font-medium text-[#6c6768] text-base md:text-lg">
                대덕SW고의 전공동아리 공고를
                <br />
                쉽고 빠르게 확인할 수 있어요
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Image
                src="/images/landing/page1.png"
                alt="공고 화면 1"
                width={500}
                height={310}
                className="w-full rounded-lg shadow-md"
              />
              <Image
                src="/images/landing/page2.png"
                alt="공고 화면 2"
                width={400}
                height={280}
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>

        {/* Apply Section */}
        <section
          ref={applyRef}
          id={applyId}
          className={`mb-20 transition-all duration-1000 ease-out md:mb-32 ${
            visibleSections.has(applyId)
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 lg:order-1">
              <Image
                src="/images/landing/page3.png"
                alt="지원 관리 화면"
                width={550}
                height={410}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-2 flex items-center gap-2 md:mb-4">
                <Image
                  src="/images/landing/article.png"
                  alt=""
                  width={18}
                  height={16}
                />
                <p className="font-bold text-[#ff4a50] text-lg md:text-xl">
                  지원 관리
                </p>
              </div>
              <h3 className="mb-4 font-bold text-2xl text-[#524d4e] leading-tight md:mb-6 md:text-3xl lg:text-4xl">
                <span className="block">전공동아리 지원 내역을</span>
                <span className="block">한 눈에 확인해보세요.</span>
              </h3>
              <p className="font-medium text-[#6c6768] text-base md:text-lg">
                마이페이지에서 자신이 지원한
                <br />
                전공동아리를 쉽고 간편하게 확인할 수 있어요
              </p>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section
          ref={calendarRef}
          id={calendarId}
          className={`transition-all duration-1000 ease-out ${
            visibleSections.has(calendarId)
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="mb-2 font-bold text-[#ff4a50] text-lg md:mb-4 md:text-xl">
                우리의 시간은 소중하니까
              </p>
              <h3 className="mb-4 font-bold text-2xl text-[#524d4e] leading-tight md:mb-6 md:text-3xl lg:text-4xl">
                <span className="block">복잡하고 귀찮은</span>
                <span className="block">일들과 작별해보세요</span>
              </h3>
              <p className="font-medium text-[#6c6768] text-base md:text-lg">
                큐알 코드가 붙은 포스터, 동아리 정보들
                <br />
                면접 일정 관리, 공지, 합격 결과 알리기
                <br />
                <br />
                대동여지도와 함께라면 더이상 번거롭지 않아요
              </p>
            </div>
            <div>
              <Image
                src="/images/icons/calender.png"
                alt="달력"
                width={500}
                height={610}
                className="w-full max-w-md"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
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
              FRONTEND: 지도현, 최민수 | BACKEND: 박태수, 채도훈 | DESIGN:
              손희찬
            </p>
            <p>주소 : 대전광역시 유성구 가정북로 76</p>
          </div>
          <p className="mt-4 text-[#bdbdbd] text-xs md:text-sm">
            @DAEDONGYEOJIDO
          </p>

          <div className="mt-6 flex items-center justify-end">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-[#5c6168] px-4 py-2 transition-colors hover:bg-[#6c7178] md:px-6 md:py-3"
            >
              <Image
                src="/images/icons/inquire.png"
                alt=""
                width={14}
                height={14}
                className="opacity-70"
              />
              <span className="text-sm text-white">문의하기</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
