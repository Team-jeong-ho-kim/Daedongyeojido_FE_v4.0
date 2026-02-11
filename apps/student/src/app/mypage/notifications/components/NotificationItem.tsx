import Image from "next/image";
import type { Alarm, AlarmCategory } from "@/types";
import type { ActionType } from "../constants/notifications";

type NotificationItemProps = {
  alarm: Alarm;
  isExpanded: boolean;
  onToggle: () => void;
  onAction: (
    type: ActionType,
    alarmId: number,
    category: AlarmCategory,
  ) => void;
};

export const NotificationItem = ({
  alarm,
  isExpanded,
  onToggle,
  onAction,
}: NotificationItemProps) => {
  const showActionButtons =
    alarm.category !== "COMMON" && !alarm.isExecuted && isExpanded;

  const acceptText = alarm.category === "CLUB_ACCEPTED" ? "합류" : "수락";

  const handleActionClick = (type: ActionType) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction(type, alarm.id, alarm.category);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-gray-50 transition-colors hover:bg-gray-100">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-8 py-6"
      >
        <span className="font-medium text-base text-gray-900">
          {alarm.title}
        </span>
        <div className="flex items-center gap-6">
          <div
            className="transition-transform duration-300"
            style={{
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <Image
              src="/images/clubs/rightArrow.svg"
              alt="상세보기"
              width={10}
              height={18}
            />
          </div>
        </div>
      </button>

      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? "300px" : "0px",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="border-gray-200 border-t px-8 py-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            {alarm.content}
          </p>

          {showActionButtons && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleActionClick("reject")}
                className="rounded-lg bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500"
              >
                거절
              </button>
              <button
                type="button"
                onClick={handleActionClick("accept")}
                className="rounded-lg bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d]"
              >
                {acceptText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
