"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { useUserStore } from "shared";
import { Button } from "ui";
import { useDeleteApplicationFormMutation } from "@/hooks/mutations/useApplicationForm";
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
  const { mutate: deleteApplicationFormMutate, isPending: isDeleting } =
    useDeleteApplicationFormMutation();

  const role = useUserStore((state) => state.userInfo?.role);
  const isClubMember = role === "CLUB_MEMBER" || role === "CLUB_LEADER";

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading || !formDetail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">지원서 정보를 불러오는 중...</p>
      </main>
    );
  }

  const dateString = formDetail.submissionDuration
    ? typeof formDetail.submissionDuration === "string"
      ? formDetail.submissionDuration
      : formDetail.submissionDuration
          .map((n) => String(n).padStart(2, "0"))
          .join("-")
    : "마감일 미정";

  const handleDelete = () => {
    deleteApplicationFormMutate(applicationFormId, {
      onSuccess: () => {
        if (clubId) {
          router.push(`/clubs/${clubId}?tab=history&subtab=form`);
        } else {
          router.back();
        }
      },
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white px-8 py-12 shadow-sm md:px-16 md:py-16 lg:px-28 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Club Info */}
          <div className="mb-10 flex items-center gap-5">
            {formDetail.clubImage ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-full md:h-20 md:w-20">
                <Image
                  src={formDetail.clubImage}
                  alt={`${formDetail.clubName} 로고`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 md:h-20 md:w-20">
                <span className="font-bold text-gray-500 text-xl">
                  {formDetail.clubName?.[0]}
                </span>
              </div>
            )}
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
              {formDetail.major?.map((major) => (
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
          <div className="flex flex-col gap-6 border-gray-200 border-t pt-10">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (clubId) {
                    router.push(`/clubs/${clubId}?tab=history&subtab=form`);
                  } else {
                    router.back();
                  }
                }}
                className="flex-1"
              >
                목록으로
              </Button>
            </div>

            {/* 삭제 버튼 - 동아리 멤버/리더만 표시 */}
            {isClubMember && (
              <div className="flex justify-end">
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-sm">
                      정말 삭제하시겠습니까?
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isDeleting ? "삭제 중..." : "삭제"}
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-lg border border-red-500 px-4 py-2 text-red-500 text-sm hover:bg-red-50"
                  >
                    지원서 폼 삭제
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
