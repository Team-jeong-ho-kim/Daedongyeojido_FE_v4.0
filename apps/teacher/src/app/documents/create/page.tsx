import type { Metadata } from "next";
import { DocumentCreationForm } from "@/features/documents";

export const metadata: Metadata = {
  title: "원페이저 양식 작성하기",
  description: "동아리 원페이저 양식을 작성하는 페이지입니다.",
};

export default function CreateDocumentPage() {
  return (
    <main className="mt-16 flex min-h-screen justify-center bg-gray-50">
      <DocumentCreationForm />
    </main>
  );
}
