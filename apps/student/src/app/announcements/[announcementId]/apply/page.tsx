"use client";

export const runtime = "edge";

import { useRouter } from "next/navigation";
import { use, useEffect, useId, useRef, useState } from "react";
import { getMajorLabel, useUserStore } from "shared";
import { toast } from "sonner";
import { TextArea, TextInput } from "ui";
import { ApiError, getSessionUser } from "utils";
import { getDetailAnnouncement } from "@/api/announcement";
import {
  getApplicationFormDetail,
  submitApplication,
} from "@/api/applicationForm";
import { ClubHeader } from "@/components";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import { hasAccessToken } from "@/lib/auth";
import { useModalStore } from "@/stores/useModalStore";

const INTRODUCTION_MAX_LENGTH = 500;
const QUESTION_ANSWER_MAX_LENGTH = 500;
const TEXTAREA_MAX_HEIGHT = 320;

const showApiError = (error: unknown, fallbackMessage: string) => {
  toast.error(error instanceof ApiError ? error.description : fallbackMessage);
};

export default function ApplyDetailPage({
  params,
}: {
  params: Promise<{ announcementId: string }>;
}) {
  const { announcementId } = use(params);
  const router = useRouter();
  const id = useId();
  const storeRole = useUserStore((state) => state.userInfo?.role);
  const role = storeRole ?? getSessionUser()?.role ?? null;
  const isClubAffiliated = role === "CLUB_MEMBER" || role === "CLUB_LEADER";

  const [applicationForm, setApplicationForm] = useState<any>(null);
  const [applicationFormId, setApplicationFormId] = useState<string | null>(
    null,
  );
  const [clubId, setClubId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

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
    major: "",
    answers: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { show, toggleShow } = useModalStore();
  const isInitialMount = useRef(true);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const nextValue =
      name === "introduction" && value.length > INTRODUCTION_MAX_LENGTH
        ? value.slice(0, INTRODUCTION_MAX_LENGTH)
        : value;

    if (name === "introduction" && value.length > INTRODUCTION_MAX_LENGTH) {
      toast.warning("자기소개는 500자까지 입력 가능합니다", {
        id: "application-introduction-length-limit",
      });
    }

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    const nextValue =
      value.length > QUESTION_ANSWER_MAX_LENGTH
        ? value.slice(0, QUESTION_ANSWER_MAX_LENGTH)
        : value;

    if (value.length > QUESTION_ANSWER_MAX_LENGTH) {
      toast.warning("질문 답변은 500자까지 입력 가능합니다", {
        id: "application-answer-length-limit",
      });
    }

    setFormData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: nextValue },
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

    applicationForm.content.forEach((question: any, index: number) => {
      if (!formData.answers[question.applicationQuestionId]?.trim()) {
        newErrors[`answer_${question.applicationQuestionId}`] =
          `질문 ${index + 1}의 답변을 입력해주세요`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (!validateForm()) {
      toast.error("필수 항목을 모두 입력해주세요");
      return false;
    }
    if (!applicationFormId) {
      toast.error("지원서 폼 정보를 불러올 수 없습니다.");
      return false;
    }
    setIsSubmitting(true);
    try {
      const submitData = {
        userName: formData.name,
        classNumber: formData.studentId,
        introduction: formData.introduction,
        major: formData.major,
        answer: applicationForm.content.map(
          (question: { applicationQuestionId: number }) => ({
            applicationQuestionId: question.applicationQuestionId,
            answer: formData.answers[question.applicationQuestionId] || "",
          }),
        ),
      };
      await submitApplication(applicationFormId, submitData);
      toast.success("지원서가 생성되었습니다.");
      // 성공 시 임시저장 데이터 삭제
      localStorage.removeItem(`apply_${announcementId}`);
      return true;
    } catch (error) {
      console.error("제출 실패:", error);
      showApiError(error, "지원서 생성에 실패했습니다.");
      return false;
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
    try {
      // 명시적으로 현재 상태 저장
      localStorage.setItem(`apply_${announcementId}`, JSON.stringify(formData));
      // 이동한 페이지에서 토스트 표시용 플래그
      localStorage.setItem(`tempSave_${announcementId}`, "true");
      toggleShow();
      router.push(`/announcements/${announcementId}`);
    } catch (error) {
      console.error("임시저장 실패:", error);
      toast.error("임시저장에 실패했습니다.");
    }
  };

  const handleConfirm = async () => {
    const success = await handleSubmit();
    if (success) {
      toggleShow();
      router.push("/mypage");
    }
  };

  // 공고 및 지원서 폼 조회
  useEffect(() => {
    if (!hasAccessToken()) {
      toast.error("로그인 후 이용해주세요.");
      setIsUnauthorized(true);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. 공고 조회하여 applicationFormId 가져오기
        const announcement = await getDetailAnnouncement(announcementId);

        if (!isMounted) return;

        // CLOSED 상태 체크
        if (announcement.status === "CLOSED") {
          toast.error("아직 게시되지 않은 공고입니다.");
          router.push("/announcements");
          return;
        }

        if (!announcement.applicationFormId) {
          toast.error("이 공고에 연결된 지원서 폼이 없습니다.");
          router.push(`/announcements/${announcementId}`);
          return;
        }

        setClubId(String(announcement.clubId));
        setApplicationFormId(String(announcement.applicationFormId));

        // 2. 지원서 폼 조회
        const form = await getApplicationFormDetail(
          String(announcement.applicationFormId),
        );
        setApplicationForm(form);

        // 3. major 기본값 설정
        if (form.major && form.major.length > 0) {
          setFormData((prev) => ({ ...prev, major: form.major?.[0] || "" }));
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        showApiError(error, "데이터를 불러올 수 없습니다.");
        router.push(`/announcements/${announcementId}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [announcementId, router]);

  // 임시저장 불러오기
  useEffect(() => {
    if (isLoading || !applicationForm) return;

    const saved = localStorage.getItem(`apply_${announcementId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (error) {
        console.error("임시저장 데이터 파싱 실패:", error);
        localStorage.removeItem(`apply_${announcementId}`);
      }
    }
  }, [announcementId, isLoading, applicationForm]);

  // 자동 임시저장
  useEffect(() => {
    // 초기 마운트 시에는 저장하지 않음
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      localStorage.setItem(`apply_${announcementId}`, JSON.stringify(formData));
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, announcementId]);

  if (isUnauthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">로그인 후 이용해주세요.</p>
      </main>
    );
  }

  if (isLoading || !applicationForm) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">
          {isLoading
            ? "지원서 폼을 불러오는 중..."
            : "지원서 폼을 찾을 수 없습니다."}
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <ClubHeader
        clubImage={applicationForm.clubImage}
        clubName={applicationForm.clubName}
        title={applicationForm.applicationFormTitle}
        headerHref={clubId ? `/clubs/${clubId}` : undefined}
        headerLinkLabel={`${applicationForm.clubName} 동아리 상세로 이동`}
        buttonText="동아리 소개 보러가기"
        buttonHref={clubId ? `/clubs/${clubId}` : undefined}
      />
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
            helperText={`${formData.introduction.length}/${INTRODUCTION_MAX_LENGTH}`}
            autoResize={true}
            maxHeight={TEXTAREA_MAX_HEIGHT}
          />

          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-0">
            <div className="w-full font-normal text-base text-gray-900 md:w-32 md:pt-2">
              지원 전공
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              {applicationForm.major?.map((major: string) => (
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
                  {getMajorLabel(major)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-18 flex flex-col gap-8 bg-gray-50 px-6 py-8 md:px-12 md:py-10 lg:px-24">
        <h2 className="font-bold text-gray-900 text-xl">질문 답변</h2>

        <div className="flex flex-col gap-10">
          {applicationForm.content.map((question: any, index: number) => {
            const questionId = `${id}-answer-${question.applicationQuestionId}`;
            const errorKey = `answer_${question.applicationQuestionId}`;
            const answerValue =
              formData.answers[question.applicationQuestionId] || "";
            return (
              <div
                key={question.applicationQuestionId}
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
                  value={answerValue}
                  onChange={(value) =>
                    handleAnswerChange(question.applicationQuestionId, value)
                  }
                  error={errors[errorKey]}
                  helperText={`${answerValue.length}/${QUESTION_ANSWER_MAX_LENGTH}`}
                  autoResize={true}
                  maxHeight={TEXTAREA_MAX_HEIGHT}
                />
              </div>
            );
          })}
        </div>
      </div>

      {!isClubAffiliated ? (
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
      ) : null}

      <ApplicationConfirmModal
        isOpen={show}
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
