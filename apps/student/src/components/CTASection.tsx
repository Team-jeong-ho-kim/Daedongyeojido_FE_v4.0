import Image from "next/image";
import { Button } from "ui";
import { tigerImg } from "../../public/images/clubs";

interface CTASectionProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
}

/**
 * Render a responsive call-to-action section with a title, subtitle, description, button, and accompanying image.
 *
 * @param title - Main heading text displayed prominently at the start of the section
 * @param subtitle - Bolded subheading displayed under the title
 * @param description - Supporting descriptive text shown below the subtitle
 * @param buttonText - Label shown inside the CTA button
 * @returns The CTA section as a JSX element
 */
export default function CTASection({
  title,
  subtitle,
  description,
  buttonText,
}: CTASectionProps) {
  return (
    <div className="flex flex-col items-center gap-10 px-6 md:flex-row md:justify-between md:px-20 xl:px-40">
      {/* 텍스트 영역 */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="font-bold text-2xl text-gray-900 md:text-3xl">
          {title}
        </h2>
        <p className="mb-3 font-bold text-gray-900 text-lg md:text-xl">
          {subtitle}
        </p>
        <p className="mb-10 text-gray-600 md:mb-14">{description}</p>
        <Button className="rounded-xl bg-primary-50 px-6 py-4 text-base text-primary-500 hover:bg-primary-100 md:px-7 md:py-6 md:text-[18px]">
          {buttonText}
        </Button>
      </div>

      {/* 이미지 영역 */}
      <div className="flex-shrink-0">
        <Image
          src={tigerImg}
          alt="🐅"
          className="h-auto w-40 select-none md:w-48 xl:w-56"
        />
      </div>
    </div>
  );
}