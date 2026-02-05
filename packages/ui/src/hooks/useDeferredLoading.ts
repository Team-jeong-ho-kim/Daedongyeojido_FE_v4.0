import { useEffect, useState } from "react";

/**
 * 200ms 미만의 빠른 로딩에서는 스켈레톤을 보여주지 않아
 * 불필요한 깜빡임을 방지하는 훅
 *
 * @param isLoading - 로딩 상태
 * @param delay - 스켈레톤을 표시하기 전 대기 시간 (기본값: 200ms)
 * @returns 지연된 로딩 상태
 */
export function useDeferredLoading(isLoading: boolean, delay = 200): boolean {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowLoading(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, delay]);

  return showLoading;
}
