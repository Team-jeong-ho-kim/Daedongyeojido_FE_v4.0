"use client";

interface PaginationProps {
  listLen: number;
  limit: number;
  curPage: number;
  setCurPage: (page: number) => void;
}

export function Pagination({
  listLen,
  limit,
  curPage,
  setCurPage,
}: PaginationProps) {
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
