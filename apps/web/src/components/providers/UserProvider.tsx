"use client";

import { useEffect } from "react";
import { useMyInfo } from "@/hooks/useMyInfo";
import { getAccessToken } from "@/lib/token";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const token = getAccessToken();

  // 토큰이 있으면 자동으로 사용자 정보 로드
  const { isLoading } = useMyInfo({
    enabled: !!token, // 토큰이 있을 때만 실행
  });

  // 로딩 중일 때 처리 (선택사항)
  // if (isLoading && token) {
  //   return <div>Loading user info...</div>;
  // }

  return <>{children}</>;
}
