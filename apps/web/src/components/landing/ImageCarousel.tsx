"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { carouselImages as images } from "./data";

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl lg:max-w-3xl">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-[16/10] w-full flex-shrink-0"
            >
              <Image
                src={image.src}
                alt={`hero ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
        }
        className="-translate-y-1/2 -left-10 md:-left-14 absolute top-1/2 rounded-full bg-gray-100 p-2.5 text-gray-500 shadow-md transition-colors hover:bg-gray-200 md:p-3"
        aria-label="이전 슬라이드"
      >
        <svg
          className="size-5 md:size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="-translate-y-1/2 -right-10 md:-right-14 absolute top-1/2 rounded-full bg-gray-100 p-2.5 text-gray-500 shadow-md transition-colors hover:bg-gray-200 md:p-3"
        aria-label="다음 슬라이드"
      >
        <svg
          className="size-5 md:size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={`cursor-pointer rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "h-2 w-5 bg-[#f45851]"
                : "size-2 bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
