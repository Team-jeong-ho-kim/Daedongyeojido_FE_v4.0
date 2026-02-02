"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { Button } from "ui";
import { useGetApplicationFormDetailQuery } from "@/hooks/querys/useApplicationFormQuery";

interface ApplicationFormDetailPageProps {
  params: Promise<{ applicationFormId: string }>;
}

export default function ApplicationFormDetailPage({
  params,
}: ApplicationFormDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { applicationFormId } = use(params);
  const clubId = searchParams.get("clubId");
  const { data: formDetail, isLoading } =
    useGetApplicationFormDetailQuery(applicationFormId);

  if (isLoading || !formDetail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">지원서 정보를 불러오는 중...</p>
      </main>
    );
  }

  const [year, month, day] = formDetail.submissionDuration;
  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white px-8 py-12 shadow-sm md:px-16 md:py-16 lg:px-28 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Club Info */}
          <div className="mb-10 flex items-center gap-5">
            <div className="relative h-16 w-16 overflow-hidden rounded-full md:h-20 md:w-20">
              <Image
                src={formDetail.clubImage}
                alt={formDetail.clubName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-xl md:text-2xl">
                {formDetail.clubName}
              </h2>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 font-bold text-2xl text-gray-900 md:text-3xl">
            {formDetail.applicationFormTitle}
          </h1>

          {/* Deadline */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-base text-gray-600">
              마감일: {dateString}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 py-12 md:px-16 md:py-16 lg:px-28 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Major Tags */}
          <div className="mb-12">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg">
              모집 분야
            </h3>
            <div className="flex flex-wrap gap-3">
              {formDetail.major.map((major) => (
                <span
                  key={major}
                  className="rounded-full border border-primary-500 bg-primary-50 px-4 py-1.5 font-medium text-primary-500 text-sm"
                >
                  {major}
                </span>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="mb-12">
            <h3 className="mb-6 font-semibold text-gray-900 text-lg">
              지원서 질문
            </h3>
            <div className="space-y-6">
              {formDetail.content.map((question, index) => (
                <div
                  key={question.applicationQuestionId}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 font-medium text-sm text-white">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-gray-800">{question.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 border-gray-200 border-t pt-10">
            <Button
              variant="outline"
              onClick={() => {
                if (clubId) {
                  router.push(`/clubs/${clubId}?tab=history&subtab=form`);
                } else {
                  router.back();
                }
              }}
              className="w-full"
            >
              목록으로
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
