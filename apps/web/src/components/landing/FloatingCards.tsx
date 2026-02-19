"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { floatingCards as cards } from "./data";

export function FloatingCards() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative hidden py-12 lg:block lg:h-[600px] lg:py-16">
      <div
        ref={ref}
        className="relative mx-auto flex h-full max-w-6xl items-center justify-center"
      >
        {cards.map((card) => (
          <div
            key={card.alt}
            className={`transition-all duration-700 ${card.className} ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${card.delay}ms` }}
          >
            <Image
              src={card.src}
              alt={card.alt}
              width={card.width}
              height={card.height}
              className="rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
