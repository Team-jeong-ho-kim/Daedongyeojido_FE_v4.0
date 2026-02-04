"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { TextArea, TextInput } from "ui";
import type { MySubmissionDetail } from "@/api/applicationForm";
import {
  getMySubmissionDetail,
  updateMySubmission,
} from "@/api/applicationForm";

interface MySubmissionEditPageProps {
  params: Promise<{ submissionId: string }>;
}

export default function MySubmissionEditPage({
  params,
}: MySubmissionEditPageProps) {
  const router = useRouter();
  const { submissionId } = use(params);
  const [submission, setSubmission] = useState<MySubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<{
    introduction: string;
    major: string;
    answers: Record<number, string>;
  }>({
    introduction: "",
    major: "",
    answers: {},
  });

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        const data = await getMySubmissionDetail(submissionId);
        setSubmission(data);
        setFormData({
          introduction: data.introduction || "",
          major: data.major || "",
          answers: data.contents.reduce<Record<number, string>>((acc, item) => {
            acc[item.applicationQuestionId] = item.answer || "";
            return acc;
          }, {}),
        });
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

  const formatDeadline = (
    submissionDuration: string | [number, number, number],
  ) => {
    if (typeof submissionDuration === "string") {
      return submissionDuration;
    }
    return submissionDuration.map((n) => String(n).padStart(2, "0")).join("-");
  };

  const handleFieldChange = (name: "introduction" | "major", value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
    const errorKey = `answer_${questionId}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.introduction.trim()) {
      newErrors.introduction = "자기소개를 입력해주세요";
    }
    if (!formData.major.trim()) {
      newErrors.major = "지원 전공을 입력해주세요";
    }

    submission?.contents.forEach((question, index) => {
      if (!formData.answers[question.applicationQuestionId]?.trim()) {
        newErrors[`answer_${question.applicationQuestionId}`] =
          `질문 ${index + 1}의 답변을 입력해주세요`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!submission) return;
    if (!validateForm()) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateMySubmission(submissionId, {
        userName: submission.userName,
        classNumber: submission.classNumber,
        introduction: formData.introduction,
        major: formData.major,
        answer: submission.contents.map((question) => ({
          applicationQuestionId: question.applicationQuestionId,
          answer: formData.answers[question.applicationQuestionId] || "",
        })),
      });
      toast.success("지원서가 수정되었습니다.");
      router.push(`/mypage/applications/${submissionId}`);
    } catch (error) {
      console.error("지원서 수정 실패:", error);
      toast.error("지원서 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !submission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">
          {isLoading ? "지원서를 불러오는 중..." : "지원서를 찾을 수 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        {/* 상단 네비게이션 */}
        <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <Link href="/mypage/applications" className="hover:text-gray-600">
            나의 지원서
          </Link>
          <span>&gt;</span>
          <Link
            href={`/mypage/applications/${submissionId}`}
            className="hover:text-gray-600"
          >
            지원서 상세
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">지원서 수정</span>
        </div>

        {/* 동아리 정보 헤더 */}
        <div className="mb-12 flex items-center gap-6">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            {submission.clubImage ? (
              <Image
                src={submission.clubImage}
                alt={submission.clubName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#7D5C5C]">
                <span className="font-bold text-2xl text-white">
                  {submission.clubName[0]}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="mb-2 font-extrabold text-3xl tracking-tight">
              {submission.clubName}
            </h1>
            <p className="text-gray-600 text-sm">
              지원 마감일: {formatDeadline(submission.submissionDuration)}
            </p>
          </div>
        </div>

        {/* 지원자 정보 (수정 불가) */}
        <div className="mb-12 rounded-2xl bg-gray-50 p-8">
          <h2 className="mb-6 font-bold text-xl">지원자 정보</h2>
          <div className="space-y-6">
            <TextInput label="이름" value={submission.userName} disabled />
            <TextInput label="학번" value={submission.classNumber} disabled />
          </div>
        </div>

        {/* 자기소개 */}
        <div className="mb-12">
          <h2 className="mb-4 font-bold text-xl">자기소개</h2>
          <TextArea
            name="introduction"
            placeholder="자기소개를 작성해주세요."
            value={formData.introduction}
            onChange={(value) => handleFieldChange("introduction", value)}
            error={errors.introduction}
          />
        </div>

        {/* 지원 전공 */}
        <div className="mb-12">
          <h2 className="mb-4 font-bold text-xl">지원 전공</h2>
          <TextInput
            name="major"
            placeholder="지원 전공을 입력해주세요."
            value={formData.major}
            onChange={(value) => handleFieldChange("major", value)}
            error={errors.major}
          />
        </div>

        {/* 질문 답변 */}
        <div className="mb-12">
          <h2 className="mb-6 font-bold text-xl">질문 답변</h2>
          <div className="space-y-6">
            {submission.contents.map((item, index) => {
              const errorKey = `answer_${item.applicationQuestionId}`;
              return (
                <div
                  key={item.applicationQuestionId}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 font-medium text-sm text-white">
                      {index + 1}
                    </span>
                    <p className="flex-1 font-semibold text-gray-900">
                      Q. {item.question}
                    </p>
                  </div>
                  <div className="ml-9">
                    <TextArea
                      placeholder="질문의 답변을 작성해주세요."
                      value={formData.answers[item.applicationQuestionId] || ""}
                      onChange={(value) =>
                        handleAnswerChange(item.applicationQuestionId, value)
                      }
                      error={errors[errorKey]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => router.push(`/mypage/applications/${submissionId}`)}
            className="rounded-xl border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-primary-500 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
