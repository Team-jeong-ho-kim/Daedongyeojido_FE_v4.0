import Image from "next/image";
import Link from "next/link";

interface Club {
  club_id: number;
  name: string;
  image: string;
}

export default function ClubSection() {
  // 예시 데이터 (실제로는 props나 API에서 받아올 데이터)
  const clubs: Club[] = [
    { club_id: 1, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 2, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 3, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 4, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 5, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 6, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 7, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 8, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 9, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 10, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 11, name: "동아리명", image: "/images/clubs/placeholder.png" },
    { club_id: 12, name: "동아리명", image: "/images/clubs/placeholder.png" },
  ];

  return (
    <section className="w-full bg-gray-100 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Link href={"/clubs"} className="group mb-6 inline-block md:mb-8">
          <h2 className="font-bold text-gray-900 text-lg md:text-xl lg:text-2xl">
            <span className="inline-flex items-center gap-2 group-hover:underline group-hover:underline-offset-6 md:gap-3">
              대덕소프트웨어마이스터고등학교
              <Image
                src="/images/clubs/rightArrow.svg"
                alt="arrow"
                width={12}
                height={20}
              />
            </span>
            <br />
            <span className="group-hover:underline group-hover:underline-offset-6">
              동아리 알아보기
            </span>
          </h2>
        </Link>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {clubs.map((club) => (
            <Link
              key={club.club_id}
              href={`/clubs/${club.club_id}`}
              className="flex items-center justify-between rounded-lg bg-white px-4 py-3 transition-shadow hover:shadow-md md:px-6 md:py-4"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-stone-800 md:h-12 md:w-12">
                  <Image
                    src={club.image}
                    alt={club.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-medium text-gray-900 text-sm md:text-base">
                  {club.name}
                </span>
              </div>
              <Image
                src="/images/clubs/rightArrow.svg"
                alt="상세보기"
                width={8}
                height={14}
                className="opacity-40"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
