"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "ui";
import ClubItem from "@/components/ClubItem";
import Pagination from "@/components/Pagination";
import { tigerImg } from "../../../public/images/clubs";

export default function ClubsPage() {
  const [curPage, setCurPage] = useState(1);
  const limit = 8;

  const clubs = [
    {
      clubId: 1,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 2,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 3,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 4,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 5,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 6,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 7,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 8,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 9,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 10,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 11,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 12,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 13,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 14,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
    {
      clubId: 15,
      clubName: "DMS",
      clubImage: "",
      introduction:
        "전공 동아리 DMS는 기숙사 관리를 보다 편리하게 관리하는 필수적인 DMS 기숙사 관리 시스템입니다.",
    },
  ];

  return (
    <main className="flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mr-10 mb-8 flex justify-end">
          <Button
            variant="ghost"
            className="cursor-pointer rounded-xl bg-gray-50 p-6 text-gray-400 hover:bg-gray-100 hover:text-gray-800"
          >
            동아리 개설 신청하기
          </Button>
        </div>

        {/* 동아리 */}
        <div className="mb-10 flex flex-wrap gap-7">
          {clubs.slice((curPage - 1) * limit, curPage * limit).map((club) => (
            <ClubItem key={club.clubId} {...club} />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-30 mb-30">
          <Pagination
            listLen={clubs.length}
            limit={limit}
            curPage={curPage}
            setCurPage={setCurPage}
          />
        </div>

        {/* CTA 섹션 */}
        <div className="flex items-center justify-between px-22">
          <div className="flex-1">
            <h2 className="font-bold text-3xl text-gray-900">
              발견한 동아리에 지원하고 싶나요?
            </h2>
            <p className="mb-3 font-bold text-gray-900 text-xl">
              아래 버튼을 눌러 바로 지원하는 페이지로 이동해보세요!
            </p>
            <p className="mb-14 text-gray-600">
              아래 버튼을 눌러 지원해보세요!
            </p>
            <Button className="primary-500 cursor-pointer rounded-xl bg-primary-50 px-7 py-6 text-[18px] text-primary-500 hover:bg-primary-100">
              지원하러가기
            </Button>
          </div>
          <div className="ml-8 flex-shrink-0">
            <div className="flex items-center">
              {/* 호랑이 이미지*/}
              <Image src={tigerImg} className="h-auto w-42" alt="🐅" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
