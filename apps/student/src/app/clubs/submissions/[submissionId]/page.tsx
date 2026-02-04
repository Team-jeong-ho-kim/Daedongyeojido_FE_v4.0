"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import type { SubmissionDetail } from "@/api/applicationForm";
import { getSubmissionDetail } from "@/api/applicationForm";

interface SubmissionDetailPageProps {
  params: Promise<{ submissionId: string }>;
}

export default function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const router = useRouter();
  const { submissionId } = use(params);
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        const data = await getSubmissionDetail(submissionId);
        setSubmission(data);
      } catch (error) {
        console.error("지원내역 조회 실패:", error);
        toast.error("지원내역을 불러올 수 없습니다.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId, router]);

  if (isLoading || !submission) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">
          {isLoading
            ? "지원내역을 불러오는 중..."
            : "지원내역을 찾을 수 없습니다."}
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="border-gray-200 border-b bg-white px-6 py-6 md:px-12 lg:px-24">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 text-sm hover:text-gray-900"
        >
          ← 뒤로 가기
        </button>
        <h1 className="font-bold text-2xl text-gray-900 md:text-3xl">
          지원내역 상세
        </h1>
      </div>

      {/* 지원자 정보 */}
      <div className="bg-gray-50 px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-16">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          {/* 이름 */}
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              이름
            </h2>
            <p className="text-[14px] text-gray-700 md:text-[15px]">
              {submission.userName}
            </p>
          </section>

          {/* 학번 */}
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              학번
            </h2>
            <p className="text-[14px] text-gray-700 md:text-[15px]">
              {submission.classNumber}
            </p>
          </section>

          {/* 지원 전공 */}
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              지원 전공
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-red-300 px-3 py-1 text-[12px] text-red-500 md:text-[13px]">
                {submission.major}
              </span>
            </div>
          </section>

          {/* 자기소개 */}
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              자기소개
            </h2>
            <p className="max-w-[700px] text-[14px] text-gray-700 md:text-[15px]">
              {submission.introduction}
            </p>
          </section>

          {/* 질문 답변 */}
          {submission.answers.map((answer, index) => (
            <section
              key={answer.questionId}
              className="flex flex-col gap-2 md:flex-row md:gap-0"
            >
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                질문 {index + 1}
              </h2>
              <div className="flex flex-col gap-2">
                <p className="rounded-md border border-gray-300 bg-gray-200 px-3 py-2 font-semibold text-[13px] text-gray-900 md:text-[14px]">
                  Q. {answer.questionContent}
                </p>
                <p className="max-w-[700px] text-[14px] text-gray-700 md:text-[15px]">
                  {answer.content}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
