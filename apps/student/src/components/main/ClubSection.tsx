"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetAllClubsQuery } from "@/hooks/querys/useClubQuery";
import { EmptyPeopleIcon } from "../icons";

export default function ClubSection() {
  const { data: clubs } = useGetAllClubsQuery();

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

        {clubs && clubs.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {clubs.map((club) => (
              <Link
                key={club.clubId}
                href={`/clubs/${club.clubId}`}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 transition-shadow hover:shadow-md md:px-6 md:py-4"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-stone-800 md:h-12 md:w-12">
                    <Image
                      src={club.clubImage}
                      alt={club.clubName}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-900 text-sm md:text-base">
                    {club.clubName}
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
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white px-4 py-12 md:px-8 md:py-16">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 md:h-24 md:w-24">
              <EmptyPeopleIcon />
            </div>
            <p className="mb-2 font-medium text-base text-gray-900 md:text-lg">
              등록된 동아리가 없습니다
            </p>
            <p className="text-center text-gray-500 text-sm md:text-base">
              동아리 정보가 등록되면 이곳에서 확인할 수 있어요
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
