import Image from "next/image";

export const EmptyNotifications = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Image
        src="/images/icons/redTiger.svg"
        alt="알림 없음"
        width={194}
        height={201}
        className="mb-8"
      />
      <p className="text-center text-base text-gray-500">알림함이 비어있어요</p>
    </div>
  );
};
