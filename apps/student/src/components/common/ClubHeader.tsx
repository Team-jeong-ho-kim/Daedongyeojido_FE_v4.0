import Image from "next/image";

interface ClubHeaderProps {
  clubImage: string;
  clubName: string;
  title: string;
  subtitle?: string;
  oneLiner?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function ClubHeader({
  clubImage,
  clubName,
  title,
  subtitle = "전공동아리",
  oneLiner,
  buttonText,
  onButtonClick,
}: ClubHeaderProps) {
  return (
    <>
      <div className="flex items-start px-6 pt-8 pb-6 md:px-12 md:pt-10 lg:px-24 lg:pt-12 lg:pb-8">
        <div className="flex items-start gap-4 md:gap-6 lg:gap-8">
          <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[16px] bg-gray-200 md:h-[88px] md:w-[88px] md:rounded-[18px] lg:h-[104px] lg:w-[104px] lg:rounded-[20px]">
            <Image
              src={clubImage}
              alt={clubName}
              width={104}
              height={104}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-1 pt-2 md:pt-3">
            <h1 className="font-semibold text-[22px] text-gray-900 md:text-[25px] lg:text-[28px]">
              {title}
            </h1>
            <p className="text-[13px] text-gray-400 md:text-[14px] lg:text-[15px]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {oneLiner && (
        <div className="flex flex-col items-center gap-4 px-6 py-6 md:flex-row md:justify-center md:gap-6 md:px-12 md:py-8 lg:gap-8 lg:px-24 lg:py-10">
          <div className="flex w-full max-w-[1200px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 md:rounded-3xl md:px-7 md:py-3.5 lg:px-9">
            <p className="text-center text-[13px] text-gray-600 md:text-[14px] lg:text-[15px]">
              " {oneLiner} "
            </p>
          </div>
          {buttonText && onButtonClick && (
            <button
              type="button"
              onClick={onButtonClick}
              className="w-full flex-shrink-0 cursor-pointer rounded-[10px] bg-primary-500 px-8 py-3 font-medium text-[14px] text-white hover:bg-primary-700 hover:text-gray-200 md:w-auto md:px-12 md:py-3.5 md:text-[15px] lg:px-20"
            >
              {buttonText}
            </button>
          )}
        </div>
      )}
    </>
  );
}
