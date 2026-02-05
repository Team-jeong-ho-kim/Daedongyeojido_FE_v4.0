"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getResultDuration } from "@/api/applicationForm";

export default function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [resultPeriod, setResultPeriod] = useState<string>("발표 기간 미정");

  useEffect(() => {
    const fetchResultDuration = async () => {
      const data = await getResultDuration();
      if (data?.resultDuration) {
        // 날짜 및 시간 포맷팅 (예: "2026-08-01T17:30:00" -> "8월 1일 오후 5시 30분")
        const date = new Date(data.resultDuration);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour24 = date.getHours();
        const minute = date.getMinutes();

        // 12시간 형식으로 변환
        const period = hour24 < 12 ? "오전" : "오후";
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

        setResultPeriod(
          `발표일: ${month}월 ${day}일 ${period} ${hour12}시${minute > 0 ? ` ${minute}분` : ""}`,
        );
      } else {
        setResultPeriod("발표 기간이 설정되지 않았습니다");
      }
    };

    fetchResultDuration();
  }, []);

  const slides = [
    {
      id: "slide-1",
      title: "동아리 모집 기간, 나의 전공 동아리 찾기",
      description: "대덕소프트웨어마이스터고등학교 전공 동아리에 지원하세요!",
    },
    {
      id: "slide-2",
      title: "새로운 경험을 시작하세요",
      description: "다양한 전공 동아리가 여러분을 기다립니다",
    },
    {
      id: "slide-3",
      title: "함께 성장하는 동아리 생활",
      description: "열정적인 동료들과 함께 배우고 성장하세요",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-black md:h-[600px] lg:h-[650px]">
      <div className="relative mx-auto h-full max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <div className="absolute top-8 left-4 h-24 w-24 animate-float md:top-12 md:left-8 md:h-32 md:w-32 lg:h-48 lg:w-48">
          <Image
            src="/images/main/redChat.svg"
            alt="채팅 아이콘"
            width={192}
            height={192}
          />
        </div>

        <div className="absolute top-12 right-4 h-28 w-28 animate-float-delayed md:top-16 md:right-8 md:h-40 md:w-40 lg:h-50 lg:w-50">
          <Image
            src="/images/main/redStar.svg"
            alt="별 아이콘"
            width={180}
            height={180}
          />
        </div>

        <div className="absolute right-8 bottom-20 hidden animate-pulse-slow md:right-16 md:bottom-24 md:block lg:right-32 lg:bottom-32">
          <Image
            src="/images/main/redBar.svg"
            alt="장식 바"
            width={200}
            height={100}
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 text-center">
          <div className="min-h-[200px] md:min-h-[250px]">
            <h1 className="mb-4 animate-fade-in font-bold text-white text-xl leading-tight md:text-2xl lg:text-3xl">
              {slides[currentSlide].title}
            </h1>
            <p className="mb-3 animate-fade-in-delayed font-bold text-base text-gray-300 md:text-lg lg:text-2xl">
              {slides[currentSlide].description}
            </p>
            <p className="animate-fade-in-delayed-more text-gray-50 text-sm md:text-base lg:text-lg">
              {resultPeriod}
            </p>
          </div>
        </div>

        <div className="-translate-x-1/2 absolute bottom-6 left-1/2 flex transform flex-col items-center gap-4 md:bottom-8 md:gap-8">
          <Link
            href={"/clubs"}
            className="transform rounded-full bg-white px-5 py-2.5 font-semibold text-black text-sm shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 md:px-6 md:py-3 md:text-base"
          >
            동아리 찾아보기
          </Link>

          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-[#157AFF]"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`슬라이드 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="-left-8 -bottom-4 md:-left-12 absolute hidden animate-float md:block">
        <Image
          src="/images/main/redSnake.svg"
          alt="뱀 장식"
          width={250}
          height={250}
        />
      </div>
    </div>
  );
}
