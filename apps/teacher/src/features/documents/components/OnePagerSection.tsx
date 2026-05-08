"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type OnePagerItem, OnePagerList } from "ui";
import { getOnePagers } from "utils";

export function OnePagerSection() {
  const [onePagers, setOnePagers] = useState<OnePagerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const loadOnePagers = async () => {
      try {
        const data = await getOnePagers();
        setOnePagers(data);
      } catch {
        toast.error("원페이저 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    void loadOnePagers();
  }, []);
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
