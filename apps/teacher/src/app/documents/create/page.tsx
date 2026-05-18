"use client";

import { useRouter } from "next/navigation";
import { DocumentCreationForm } from "@/features/documents";

export default function CreateDocumentPage() {
  const router = useRouter();

  const handleSuccess = (id?: number) => {
    if (id) {
      router.push(`/documents/${id}`);
    } else {
      router.push("/documents");
    }
  };

  return (
    <main className="mt-16 flex min-h-screen justify-center bg-gray-50">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <DocumentCreationForm mode="create" onSuccess={handleSuccess} />
      </div>
    </main>
  );
}
