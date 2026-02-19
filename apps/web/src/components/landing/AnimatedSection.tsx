"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  opacityOnly?: boolean;
}

export function AnimatedSection({
  children,
  className = "",
  opacityOnly = false,
}: Props) {
  const [state, setState] = useState<"ssr" | "hidden" | "visible">("ssr");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        } else {
          setState((prev) => (prev === "ssr" ? "hidden" : prev));
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isVisible = state !== "hidden";
  const animClass = opacityOnly
    ? isVisible
      ? "opacity-100"
      : "opacity-0"
    : isVisible
      ? "translate-y-0 opacity-100"
      : "translate-y-10 opacity-0";

  return (
    <section
      ref={ref}
      className={`transition-all duration-1000 ease-out ${animClass} ${className}`}
    >
      {children}
    </section>
  );
}
