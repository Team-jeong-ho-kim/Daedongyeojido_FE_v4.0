import type { Metadata } from "next";
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
          <h1 className="font-bold text-3xl text-gray-900">양식 조회</h1>
        </div>

        <DocumentFilesSection />
      </div>
    </main>
  );
}
