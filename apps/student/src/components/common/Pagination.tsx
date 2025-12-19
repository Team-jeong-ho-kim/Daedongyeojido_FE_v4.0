"use client";

import type { PaginationType } from "@/types";

/*
  paginationLimit: 페이지네이션 당 선언한 수의 항목으로 제한
  numPages: 만들어야 할 페이지의 갯수
  paginationArray: 페이지네이션을 사용할 numPages만큼의 배열
*/

export default function Pagination({
  listLen,
  limit,
  curPage,
  setCurPage,
}: PaginationType) {
  const paginationLimit = 8;
  const numPages = Math.ceil(listLen / limit);
  const paginationArray = Array.from({ length: numPages }, (_, i) => i + 1);

  const onClickNumber = (page: number) => {
    setCurPage(page);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {paginationArray.slice(0, paginationLimit).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onClickNumber(page)}
          className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full font-medium text-sm ${
            curPage === page
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
