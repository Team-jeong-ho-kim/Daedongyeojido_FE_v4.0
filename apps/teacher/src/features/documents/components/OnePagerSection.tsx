"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { OnePagerList } from "ui";
import { getOnePagers } from "utils";

export function OnePagerSection() {
  const router = useRouter();
  const {
    data: onePagers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["one-pagers"],
    queryFn: getOnePagers,
  });

  useEffect(() => {
    if (isError) {
      toast.error("원페이저 목록을 불러오지 못했습니다.");
    }
  }, [isError]);

  if (isLoading) {
    return <div className="text-center">로딩 중...</div>;
  }
  return (
    <div className="mt-12">
      <OnePagerList
        items={onePagers}
        onItemClick={(id) => router.push(`/documents/${id}`)}
      />
    </div>
  );
}
