import type { Metadata } from "next";
import {
  ClubCreationApplyCta,
  ClubCreationFormSection,
} from "@/features/documents";

export const metadata: Metadata = {
  title: "양식 조회",
  description:
    "동아리 개설 신청에 필요한 양식을 확인하고, 준비된 미리보기 PDF를 브라우저에서 바로 확인할 수 있습니다.",
};

export default function DocumentPage() {
  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-bold text-3xl text-gray-900">양식 조회</h1>
            <p className="mt-3 text-gray-600 text-sm leading-6 md:text-base">
              현재는 동아리 개설 신청 양식을 제공합니다. 등록된 양식은
              다운로드할 수 있고, 미리보기 PDF가 준비된 양식은 브라우저에서 바로
              확인한 뒤 작성 완료 후 개설 신청 페이지에서 업로드해 제출할 수
              있습니다.
            </p>
          </div>

          <ClubCreationApplyCta />
        </div>

        <ClubCreationFormSection embedded />
      </div>
    </main>
  );
}
