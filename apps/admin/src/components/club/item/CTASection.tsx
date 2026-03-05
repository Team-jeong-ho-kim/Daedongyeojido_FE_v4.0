import Link from "next/link";

interface CTASectionProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function CTASection(props: CTASectionProps) {
  const { title, subtitle, description, buttonText, buttonHref } = props;

  return (
    <div className="flex flex-col items-center gap-8 px-6 text-center md:px-20">
      <div>
        <h2 className="font-bold text-2xl text-gray-900 md:text-3xl">
          {title}
        </h2>
        <p className="mb-3 font-bold text-gray-900 text-lg md:text-xl">
          {subtitle}
        </p>
        <p className="text-gray-600">{description}</p>
      </div>
      <Link
        href={buttonHref}
        className="rounded-xl bg-primary-50 px-6 py-4 text-base text-primary-500 transition hover:bg-primary-100 md:px-7 md:py-5 md:text-[18px]"
      >
        {buttonText}
      </Link>
    </div>
  );
}
