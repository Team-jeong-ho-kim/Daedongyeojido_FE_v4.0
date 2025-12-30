"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface CarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export function Carousel({ images, autoPlayInterval = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [goToNext, autoPlayInterval]);

  const nextIndex = (currentIndex + 1) % images.length;

  return (
    <div className="w-full">
      <div className="relative mb-6 overflow-hidden rounded-3xl">
        {/* 다음 이미지 (뒤에 깔림) */}
        <div className="absolute inset-0">
          <Image
            src={images[nextIndex]}
            alt={`슬라이드 ${nextIndex + 1}`}
            width={800}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>

        {/* 현재 이미지 */}
        <div
          className="relative animate-fade-out"
          style={{
            animation: `fadeOut ${autoPlayInterval}ms ease-in-out infinite`,
          }}
        >
          <Image
            src={images[currentIndex]}
            alt={`슬라이드 ${currentIndex + 1}`}
            width={800}
            height={600}
            className="w-full object-cover"
          />
        </div>

        <style jsx>{`
          @keyframes fadeOut {
            0%, 40% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* 인디케이터 */}
      <div className="mb-12 flex gap-2">
        {images.map((_, index) => (
          <button
            key={`indicator-${index.toString()}`}
            type="button"
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all ${
              index === currentIndex
                ? "h-1.5 w-6 bg-red-500"
                : "h-1.5 w-1.5 bg-gray-600 hover:bg-gray-500"
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>

      <div className="text-white">
        <h1 className="mb-4 font-bold text-3xl lg:text-4xl">
          나의 동아리를 찾는 지름길,
          <br />
          동아리에 가입해서 전공 실력을 길러보세요!
        </h1>
        <p className="text-gray-400 text-lg">
          자신의 전공 분야와 맞는 동아리를 찾고
          <br />
          자신이 가입하고 싶은 동아리를 쉽게 관리 할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
