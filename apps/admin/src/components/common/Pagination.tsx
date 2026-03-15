"use client";

type PaginationProps = {
  listLen: number;
  limit: number;
  curPage: number;
  setCurPage: (page: number) => void;
};

export function Pagination(props: PaginationProps) {
  const { listLen, limit, curPage, setCurPage } = props;
  const paginationLimit = 8;
  const numPages = Math.ceil(listLen / limit);
  const paginationArray = Array.from({ length: numPages }, (_, i) => i + 1);
  const halfWindow = Math.floor(paginationLimit / 2);
  const startPage = Math.max(1, curPage - halfWindow);
  const endPage = Math.min(numPages, startPage + paginationLimit - 1);
  const adjustedStart = Math.max(1, endPage - paginationLimit + 1);
  const visiblePages = paginationArray.slice(adjustedStart - 1, endPage);

  return (
    <div className="flex items-center justify-center gap-2">
      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurPage(page)}
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
