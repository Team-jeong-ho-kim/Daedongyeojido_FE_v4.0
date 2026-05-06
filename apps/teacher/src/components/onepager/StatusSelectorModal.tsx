"use client";

import { ONE_PAGER_FILE_STATUS_OPTIONS, type OnePagerFileStatus } from "ui";

const STATUS_DOT_CLASS_NAME: Record<OnePagerFileStatus, string> = {
  제출됨: "bg-[#2f80ed]",
  승인됨: "bg-[#40EA45]",
  반려됨: "bg-[#FFB915]",
  거절됨: "bg-[#F45F5F]",
  취소됨: "bg-[#524E4E]",
};

interface StatusSelectorModalProps {
  isOpen: boolean;
  selectedStatus: OnePagerFileStatus;
  onClose: () => void;
  onChangeStatus: (status: OnePagerFileStatus) => void;
  onSave: () => void;
}

export function StatusSelectorModal({
  isOpen,
  selectedStatus,
  onClose,
  onChangeStatus,
  onSave,
}: StatusSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[374px] rounded-[20px] bg-white px-9 pt-8 pb-7 shadow-xl">
        <h3 className="text-center font-bold text-[22px] text-gray-900">
          상태 추가
        </h3>

        <div className="mt-8 flex flex-col gap-5">
          {ONE_PAGER_FILE_STATUS_OPTIONS.map((option) => {
            const selected = selectedStatus === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onChangeStatus(option)}
                className="group flex items-center justify-between text-left"
              >
                <span className="flex items-center gap-4 font-medium text-[16px] text-gray-700">
                  <span
                    className={`h-3 w-3 rounded-full ${STATUS_DOT_CLASS_NAME[option]}`}
                  />
                  {option}
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#f3a4a4]">
                  {selected ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f17373]" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] min-w-[72px] rounded-[10px] bg-[#9b9698] px-6 font-semibold text-[14px] text-white transition-colors hover:bg-gray-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSave}
            className="h-[38px] min-w-[72px] rounded-[10px] bg-[#f56565] px-6 font-semibold text-[14px] text-white transition-colors hover:bg-red-600"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
