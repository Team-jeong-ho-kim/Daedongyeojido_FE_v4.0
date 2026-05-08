"use client";

import { useState } from "react";
import { Pagination } from "./Pagination";

export interface OnePagerItem {
  onePagerFormId: number;
  title: string;
  teacher: string;
  onePagerDurationType: "INFINITY" | "DATE";
  onePagerDuration: string | null;
}

interface OnePagerListProps {
  items: OnePagerItem[];
  onItemClick?: (id: number) => void;
}

export function OnePagerList({ items, onItemClick }: OnePagerListProps) {
  const [curPage, setCurPage] = useState(1);
  const limit = 4;

  const paginatedItems = items.slice((curPage - 1) * limit, curPage * limit);

  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-[24px] border border-gray-100 bg-gray-50 text-gray-500">
        등록된 원페이저가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
                <span className="text-gray-500">지원 마감일 :</span>
                {(() => {
                  if (item.onePagerDurationType === "INFINITY") {
                    return (
                      <span className="font-semibold text-gray-800">상시</span>
                    );
                  }
                  const deadline = new Date(item.onePagerDuration ?? 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (deadline < today) {
                    return (
                      <span className="font-semibold text-primary-500">
                        마감됨
                      </span>
                    );
                  }
                  return (
                    <span className="font-semibold text-gray-800">
                      {item.onePagerDuration?.split("T")[0] ?? "없음"}
                    </span>
                  );
                })()}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">작성자 :</span>
                <span className="font-semibold text-gray-800">
                  {item.teacher}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}

      {items.length > limit && (
        <div className="mt-8">
          <Pagination
            listLen={items.length}
            limit={limit}
            curPage={curPage}
            setCurPage={setCurPage}
          />
        </div>
      )}
    </div>
  );
}
