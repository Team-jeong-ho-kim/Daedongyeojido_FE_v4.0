"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분 - 캐시 데이터를 신선하게 유지
            gcTime: 10 * 60 * 1000, // 10분 - 메모리에 데이터 보관
            refetchOnWindowFocus: false,
            refetchOnMount: false, // 마운트 시 재요청 방지 (캐시 활용)
            retry: 1, // 실패 시 1회만 재시도
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
