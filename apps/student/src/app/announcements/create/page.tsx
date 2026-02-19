"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Button, FieldSelector, FormField, TextArea, TextInput } from "ui";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import DeadlineModal from "@/components/modal/DeadlineModal";
import { FIELDS } from "@/constants/club";
import { useCreateAnnouncementMutation } from "@/hooks/mutations/useAnnouncement";
import { useModalStore } from "@/stores/useModalStore";

function CreateAnnouncementContent() {
  const searchParams = useSearchParams();
  const clubId = searchParams.get("clubId") ?? undefined;
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [idealCandidate, setIdealCandidate] = useState("");
  const [assignment, setAssignment] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const { show, toggleShow } = useModalStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createAnnouncementMutate } =
    useCreateAnnouncementMutation(clubId);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "모집 공고 제목을 입력해주세요";
    if (!contact.trim()) {
      newErrors.contact = "대표자 연락처를 입력해주세요";
    } else if (contact.replace(/-/g, "").length !== 11) {
      newErrors.contact = "올바른 전화번호 형식이 아닙니다";
    }
    if (!introduction.trim())
      newErrors.introduction = "공고 소개글을 입력해주세요";
    if (!idealCandidate.trim())
      newErrors.idealCandidate = "인재상을 입력해주세요";
    if (selectedFields.length === 0)
      newErrors.selectedFields = "모집 전공을 선택해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (value.trim()) clearError("title");
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) {
      return numbers;
    }
    if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleContactChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setContact(formatted);
    if (formatted.trim()) clearError("contact");
  };

  const handleIntroductionChange = (value: string) => {
    setIntroduction(value);
    if (value.trim()) clearError("introduction");
  };

  const handleIdealCandidateChange = (value: string) => {
    setIdealCandidate(value);
    if (value.trim()) clearError("idealCandidate");
  };

  const handleFieldsChange = (fields: string[]) => {
    setSelectedFields(fields.map((major) => major.toUpperCase()));
    if (fields.length > 0) clearError("selectedFields");
  };

  const handleOpenModal = () => {
    if (validateForm()) {
      toggleShow();
    } else {
      toast.error("필수 항목을 모두 입력해주세요");
    }
  };

  const handleSubmit = () => {
    createAnnouncementMutate({
      title: title.trim(),
      introduction: introduction.trim(),
      phoneNumber: contact.replace(/-/g, ""),
      major: selectedFields,
      deadline,
      talentDescription: idealCandidate.trim(),
      assignment: assignment.trim(),
    });
    toggleShow();
  };

  return (
    <div className="mt-20 min-h-screen bg-white">
      <div className="bg-gray-50 py-16">
        <h1 className="mb-12 text-center font-bold text-[26px]">공고 생성</h1>

        <div className="mx-auto max-w-[1200px] space-y-0 px-4">
          <FormField label="모집 공고 제목">
            <TextInput
              value={title}
              onChange={handleTitleChange}
              placeholder="모집 공고 제목을 입력해주세요."
              error={errors.title}
            />
          </FormField>

          <FormField label="대표자 연락처">
            <TextInput
              value={contact}
              onChange={handleContactChange}
              placeholder="대표자의 전화번호를 입력해주세요."
              error={errors.contact}
            />
          </FormField>

          <FormField label="공고 소개글" alignTop>
            <TextArea
              value={introduction}
              onChange={handleIntroductionChange}
              placeholder="공고 소개글을 작성해주세요."
              rows={8}
              error={errors.introduction}
            />
          </FormField>

          <FormField label="인재상 작성" alignTop>
            <TextArea
              value={idealCandidate}
              onChange={handleIdealCandidateChange}
              placeholder="인재상을 작성해주세요. (ex. 1.~을 하는 사람)"
              rows={6}
              error={errors.idealCandidate}
            />
          </FormField>

          <FormField label="과제 부여" alignTop>
            <TextArea
              value={assignment}
              onChange={setAssignment}
              placeholder="부여할 과제를 작성해주세요."
              rows={6}
            />
          </FormField>

          <FormField label="모집 전공 선택" alignTop>
            <FieldSelector
              fields={FIELDS}
              selectedFields={selectedFields}
              onSelectionChange={handleFieldsChange}
              error={errors.selectedFields}
            />
          </FormField>

          <FormField label="일정 지정">
            <div className="flex items-center justify-between">
              <p className="text-[14px] text-gray-700">
                {deadline || "일정을 지정해주세요"}
              </p>
              <Button
                type="button"
                onClick={() => setShowDeadlineModal(true)}
                className="h-8 rounded-xl bg-gray-900 px-4 py-4 font-medium text-[12px] text-white hover:bg-gray-800"
              >
                일정 지정하기
              </Button>
            </div>
          </FormField>
        </div>
      </div>

      <div className="flex justify-center py-16">
        <Button
          type="button"
          onClick={handleOpenModal}
          className="w-[500px] cursor-pointer rounded-lg bg-primary-500 py-6 font-medium text-[15px] text-white transition-colors hover:bg-primary-700 hover:text-gray-200"
        >
          공고 개설하기
        </Button>
      </div>

      <ApplicationConfirmModal
        isOpen={show}
        onClose={toggleShow}
        onConfirm={handleSubmit}
        onBackdropClick={toggleShow}
        title="정말 공고를 등록하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다."
        cancelText="닫기"
        confirmText="등록하기"
      />

      <DeadlineModal
        title="공고 지원 기간 설정"
        isOpen={showDeadlineModal}
        onClose={() => setShowDeadlineModal(false)}
        onSave={(newDeadline: string) => setDeadline(newDeadline)}
      />
    </div>
  );
}

export default function CreateAnnouncementPage() {
  return (
    <Suspense fallback={<div>공고들 불러오는 중...</div>}>
      <CreateAnnouncementContent />
    </Suspense>
  );
}
