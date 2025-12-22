"use client";

import { use, useEffect, useId, useState } from "react";
import { toast } from "react-toastify";
import { ClubHeader } from "@/components";
import { TextArea, TextInput } from "@/components/club/input";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import { useModalStore } from "@/stores/useModalStore";
import type { ApplicationFormResponse } from "@/types/announcement";

// mock data
const mockApplicationForm: ApplicationFormResponse = {
  application_form_title: "2026 대동여지도 지원서 폼",
  club_name: "대동여지도",
  club_image:
    "https://daedong-bucket.s3.ap-northeast-2.amazonaws.com/07e88aba-cc99-4cc6-ae04-62088006eeeb.jpg",
  content: [
    {
      application_question_id: 1,
      content: "지원 동기를 작성해주세요.",
    },
    {
      application_question_id: 2,
      content: "본인의 강점을 설명해주세요.",
    },
    {
      application_question_id: 3,
      content: "동아리에서 어떤 활동을 하고 싶은가요?",
    },
  ],
  submission_duration: "2026-03-15",
  major: ["BE", "FE"],
};

export default function ApplyDetailPage({
  params,
}: {
  params: Promise<{ announcementId: string }>;
}) {
  const { announcementId } = use(params);
  const id = useId();
  const applicationForm = mockApplicationForm;

  const [formData, setFormData] = useState<{
    name: string;
    studentId: string;
    introduction: string;
    major: string;
    answers: Record<number, string>;
  }>({
    name: "",
    studentId: "",
    introduction: "",
    major: applicationForm.major[0] || "",
    answers: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { show, toggleShow } = useModalStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
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
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleMajorSelect = (major: string) => {
    setFormData((prev) => ({ ...prev, major }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요";
    if (!formData.studentId.trim()) newErrors.studentId = "학번을 입력해주세요";
    if (!formData.introduction.trim())
      newErrors.introduction = "자기소개를 입력해주세요";

    applicationForm.content.forEach((question, index) => {
      if (!formData.answers[question.application_question_id]?.trim()) {
        newErrors[`answer_${question.application_question_id}`] =
          `질문 ${index + 1}의 답변을 입력해주세요`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name,
        studentId: formData.studentId,
        introduction: formData.introduction,
        major: formData.major,
        answers: applicationForm.content.map((question) => ({
          application_question_id: question.application_question_id,
          answer: formData.answers[question.application_question_id] || "",
        })),
      };
      console.log("제출:", submitData);
    } catch (error) {
      console.error("제출 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    if (validateForm()) {
      toggleShow();
    } else {
      toast.error("필수 항목을 모두 입력해주세요");
    }
  };

  const handleTempSave = () => {
    localStorage.setItem("tempSaveSuccess", "true");
    toggleShow();
  };

  const handleConfirm = () => {
    handleSubmit();
    toggleShow();
  };

  // 임시저장 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(`apply_${announcementId}`);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [announcementId]);

  // 자동 임시저장 (500ms debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(`apply_${announcementId}`, JSON.stringify(formData));
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, announcementId]);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ClubHeader
        clubImage={applicationForm.club_image}
        clubName={applicationForm.club_name}
        title={applicationForm.application_form_title}
      />
      {/* 인적 사항 섹션 */}
      <div className="mt-7 bg-gray-50 px-6 py-8 md:px-12 md:py-10 lg:px-24">
        <h2 className="mb-8 font-bold text-gray-900 text-xl">인적 사항</h2>

        <div className="flex flex-col gap-8">
          <TextInput
            label="이름"
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={(value) =>
              handleInputChange({
                target: { name: "name", value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            error={errors.name}
          />

          <TextInput
            label="학번"
            name="studentId"
            placeholder="학번"
            value={formData.studentId}
            onChange={(value) =>
              handleInputChange({
                target: { name: "studentId", value },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            error={errors.studentId}
          />

          <TextArea
            label="자기소개"
            name="introduction"
            placeholder="자기소개를 작성해주세요."
            value={formData.introduction}
            onChange={(value) =>
              handleInputChange({
                target: { name: "introduction", value },
              } as React.ChangeEvent<HTMLTextAreaElement>)
            }
            error={errors.introduction}
          />

          {/* 지원 전공 */}
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-0">
            <div className="w-full font-normal text-base text-gray-900 md:w-32 md:pt-2">
              지원 전공
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              {applicationForm.major.map((major) => (
                <button
                  key={major}
                  type="button"
                  onClick={() => handleMajorSelect(major)}
                  className={`rounded-full border px-5 py-1 font-normal text-base transition-colors ${
                    formData.major === major
                      ? "border-primary-500 bg-primary-50 text-primary-500"
                      : "border-gray-400 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {major}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 질문 답변 섹션 */}
      <div className="mt-18 flex flex-col gap-8 bg-gray-50 px-6 py-8 md:px-12 md:py-10 lg:px-24">
        <h2 className="font-bold text-gray-900 text-xl">질문 답변</h2>

        <div className="flex flex-col gap-10">
          {applicationForm.content.map((question, index) => {
            const questionId = `${id}-answer-${question.application_question_id}`;
            const errorKey = `answer_${question.application_question_id}`;
            return (
              <div
                key={question.application_question_id}
                className="flex flex-col gap-3"
              >
                <label
                  htmlFor={questionId}
                  className="font-normal text-base text-gray-900"
                >
                  Q{index + 1}. {question.content}
                </label>
                <TextArea
                  id={questionId}
                  placeholder="질문의 답변을 작성해주세요."
                  value={
                    formData.answers[question.application_question_id] || ""
                  }
                  onChange={(value) =>
                    handleAnswerChange(question.application_question_id, value)
                  }
                  error={errors[errorKey]}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* 제출 버튼 */}
      <div className="flex justify-center bg-gray-50 px-6 pt-6 pb-12 md:px-12 lg:px-24">
        <button
          type="button"
          onClick={handleOpenModal}
          disabled={isSubmitting}
          className="w-full max-w-md rounded-lg bg-[#FF7575] py-4 font-medium text-base text-white transition-colors hover:bg-[#FF6464] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? "제출 중..." : "지원하기"}
        </button>
      </div>
      <ApplicationConfirmModal
        isOpen={show}
        closeHref={`/announcements/${announcementId}`}
        confirmHref="/mypage"
        onClose={handleTempSave}
        onConfirm={handleConfirm}
        onBackdropClick={toggleShow}
        title="지원서를 생성하시겠습니까?"
        description="지원서는 마이페이지에서 조회하실 수 있습니다."
        cancelText="임시저장하고 닫기"
        confirmText="생성하기"
      />
    </main>
  );
}
