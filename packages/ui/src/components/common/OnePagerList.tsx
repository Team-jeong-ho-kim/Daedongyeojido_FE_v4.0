"use client";

import { useEffect, useState } from "react";
import { Pagination } from "./Pagination";

export interface OnePagerItem {
  onePagerFormId: number;
  title: string;
  teacherName: string;
  onePagerDurationType: "INFINITY" | "DATE";
  onePagerDuration: string | null;
}

interface OnePagerListProps {
  items: OnePagerItem[];
  onItemClick?: (id: number) => void;
}

export function OnePagerList({ items, onItemClick }: OnePagerListProps) {
  const [curPage, setCurPage] = useState(1);
  useEffect(() => {
    setCurPage(1);
  }, [items]);
  const limit = 5;

  const paginatedItems = items.slice((curPage - 1) * limit, curPage * limit);

  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-[24px] border border-gray-100 bg-gray-50 text-gray-500">
        등록된 원페이저가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex min-h-[544px] flex-col gap-4">
        {paginatedItems.map((item) => (
          <button
            key={item.onePagerFormId}
            type="button"
            className="flex w-full cursor-pointer items-center justify-between rounded-[24px] border border-gray-100 bg-gray-50 p-6"
            onClick={() => onItemClick?.(item.onePagerFormId)}
          >
            <div className="flex flex-col items-start gap-2">
              <h3 className="font-semibold text-gray-800 text-mi">
                {item.title}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {(() => {
                    if (item.onePagerDurationType === "INFINITY") {
                      return (
                        <>
                          <span className="text-gray-500">지원 마감일 :</span>
                          <span className="font-semibold text-gray-800">
                            상시
                          </span>
                        </>
                      );
                    }
                    const deadline = new Date(item.onePagerDuration ?? 0);
                    const now = new Date();
                    if (deadline < now) {
                      return (
                        <span className="font-semibold text-primary-500">
                          마감됨
                        </span>
                      );
                    }
                    return (
                      <>
                        <span className="text-gray-500">지원 마감일 :</span>
                        <span className="font-semibold text-gray-800">
                          {item.onePagerDuration?.split("T")[0] ?? "없음"}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">작성자 :</span>
                  <span className="font-semibold text-gray-800">
                    {item.teacherName}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {items.length > limit && (
        <Pagination
          listLen={items.length}
          limit={limit}
          curPage={curPage}
          setCurPage={setCurPage}
        />
      )}
    </div>
  );
}
