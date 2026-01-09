import Image from "next/image";
import Link from "next/link";

const aboutItems = [
  {
    id: 1,
    title: "대동여지도 기능",
    image: "/images/main/red.png",
    href: "/about/features",
  },
  {
    id: 2,
    title: "대동여지도의 탄생",
    image: "/images/main/yellow.png",
    href: "/about/story",
  },
  {
    id: 3,
    title: "대동여지도 팀원",
    image: "/images/main/blue.png",
    href: "/about/team",
  },
  {
    id: 4,
    title: "대동여지도 비전",
    image: "/images/main/green.png",
    href: "/about/vision",
  },
];

export default function AboutSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 lg:py-30">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Link href={"/about"} className="group mb-6 inline-block md:mb-8">
          <h2 className="inline-flex items-center gap-2 font-bold text-gray-900 text-lg group-hover:underline group-hover:underline-offset-6 md:gap-3 md:text-xl lg:text-2xl">
            대동여지도 알아보기
            <Image
              src="/images/clubs/rightArrow.svg"
              alt="arrow"
              width={12}
              height={20}
            />
          </h2>
        </Link>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {aboutItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col overflow-hidden rounded-2xl bg-gray-50 transition-shadow hover:shadow-md"
            >
              <div className="flex h-32 items-center justify-center md:h-44 lg:h-52">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={180}
                  height={180}
                  className="h-auto w-24 object-contain md:w-32 lg:w-40"
                />
              </div>
              <div className="px-4 pt-2 pb-4 text-center md:px-6 md:pb-6">
                <span className="font-medium text-gray-900 text-sm md:text-base">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
