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

  // major를 배열로 변환 (쉼표로 구분된 경우 처리)
  const majorArray =
    typeof submission.major === "string"
      ? submission.major.split(",").map((m) => m.trim())
      : [submission.major];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-8 py-16 md:px-16 md:py-20">
        {/* 헤더 - 동아리 로고 + 제목 */}
        <div className="mb-16 flex items-start gap-6">
          {/* 동아리 로고 (placeholder) */}
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-500">
            <span className="font-bold text-4xl text-white">D</span>
          </div>
          {/* 제목 */}
          <div className="flex-1">
            <h1 className="mb-2 font-bold text-2xl text-gray-900 md:text-3xl">
              지원서 상세
            </h1>
            <p className="text-gray-400 text-sm md:text-base">전공동아리</p>
          </div>
        </div>

        {/* 인적 사항 */}
        <section className="mb-16">
          <h2 className="mb-6 font-bold text-gray-900 text-xl">인적 사항</h2>

          {/* 이름 */}
          <div className="mb-6">
            <p className="mb-3 text-gray-900 text-sm">이름</p>
            <div className="rounded-lg bg-gray-100 px-5 py-4 text-base text-gray-900">
              {submission.userName}
            </div>
          </div>

          {/* 학번 */}
          <div className="mb-6">
            <p className="mb-3 text-gray-900 text-sm">학번</p>
            <div className="rounded-lg bg-gray-100 px-5 py-4 text-base text-gray-900">
              {submission.classNumber}
            </div>
          </div>

          {/* 자기소개 */}
          <div>
            <p className="mb-3 text-gray-900 text-sm">자기소개</p>
            <div className="min-h-48 rounded-lg bg-gray-100 px-5 py-4 text-base text-gray-900 leading-relaxed">
              {submission.introduction}
            </div>
          </div>
        </section>

        {/* 지원 전공 */}
        <section className="mb-16">
          <h2 className="mb-6 font-bold text-gray-900 text-xl">지원 전공</h2>
          <div className="flex flex-wrap gap-3">
            {majorArray.map((major, index) => (
              <span
                key={major}
                className={`rounded-full px-5 py-2 font-medium text-sm ${
                  index === 0
                    ? "border border-primary-500 bg-primary-50 text-primary-500"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {major}
              </span>
            ))}
          </div>
        </section>

        {/* 질문 답변 */}
        <section className="mb-16">
          <h2 className="mb-6 font-bold text-gray-900 text-xl">질문 답변</h2>
          <div className="space-y-8">
            {submission.answers.map((answer, index) => (
              <div key={answer.questionId}>
                {/* 질문 */}
                <p className="mb-3 text-base text-gray-900">
                  Q{index + 1}. {answer.questionContent}
                </p>
                {/* 답변 */}
                <div className="min-h-32 rounded-lg bg-gray-100 px-5 py-4 text-base text-gray-900 leading-relaxed">
                  {answer.content}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 버튼 */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg bg-primary-500 px-8 py-3 font-medium text-base text-white transition-colors hover:bg-primary-600"
          >
            면접 일정 설정
          </button>
        </div>
      </div>
    </main>
  );
}
