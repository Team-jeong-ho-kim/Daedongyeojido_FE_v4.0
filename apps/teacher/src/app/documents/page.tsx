import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DocumentFilesSection } from "@/features/documents";

export const metadata: Metadata = {
  title: "양식 조회",
  description:
    "등록된 동아리 개설 신청 양식을 확인하고 준비된 미리보기 PDF를 바로 확인할 수 있습니다.",
};

export default function DocumentsPage() {
  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-bold text-3xl text-gray-900">양식 조회</h1>
            <Link
              href="/documents/create"
              className="flex h-[48px] items-center gap-2 px-6 font-medium text-[#f45f5f] text-[20px] leading-none hover:text-[#f45f5f]/90"
            >
              <Image
                src="/images/icons/plus.svg"
                alt="작성하기"
                width={20}
                height={20}
              />
              작성하기
            </Link>
          </div>
        </div>
        <DocumentFilesSection />
      </div>
    </main>
  );
}
