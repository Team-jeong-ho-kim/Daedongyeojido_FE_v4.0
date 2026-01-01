"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  FieldSelector,
  FormField,
  ImageUpload,
  LinkInput,
  TextArea,
  TextInput,
} from "ui";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import { FIELDS } from "@/constants/club";
import { useModalStore } from "@/stores/useModalStore";

export default function ClubCreationPage() {
  const router = useRouter();
  const [clubName, setClubName] = useState("");
  const [clubLogo, setClubLogo] = useState<File | null>(null);
  const [clubIntro, setClubIntro] = useState("");
  const [clubLinks, setClubLinks] = useState<{ id: string; url: string }[]>([]);
  const [clubIntroDetail, setClubIntroDetail] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const { show, toggleShow } = useModalStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clubName.trim()) newErrors.clubName = "동아리 명을 입력해주세요";
    if (!clubIntro.trim())
      newErrors.clubIntro = "동아리 한줄 소개를 입력해주세요";
    if (!clubIntroDetail.trim())
      newErrors.clubIntroDetail = "동아리 소개 문구를 입력해주세요";
    if (selectedFields.length === 0)
      newErrors.selectedFields = "동아리 전공을 선택해주세요";

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

  const handleClubNameChange = (value: string) => {
    setClubName(value);
    if (value.trim()) clearError("clubName");
  };

  const handleClubIntroChange = (value: string) => {
    setClubIntro(value);
    if (value.trim()) clearError("clubIntro");
  };

  const handleClubIntroDetailChange = (value: string) => {
    setClubIntroDetail(value);
    if (value.trim()) clearError("clubIntroDetail");
  };

  const handleFieldsChange = (fields: string[]) => {
    setSelectedFields(fields);
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
    console.log({
      clubName,
      clubLogo,
      clubIntro,
      clubLinks: clubLinks.map((link) => link.url),
      clubIntroDetail,
      selectedFields,
    });
    toast.success(
      "개설 신청이 완료되었습니다. 관리자에서 수락 시 동아리가 개설됩니다",
    );
    toggleShow();
    router.push("/mypage/alarm");
  };

  return (
    <div className="mt-20 min-h-screen bg-white">
      <div className="bg-gray-50 py-16">
        <h1 className="mb-12 text-center font-bold text-[26px]">동아리 생성</h1>

        <div className="mx-auto max-w-[1200px] space-y-0 px-4">
          <FormField label="동아리 명">
            <TextInput
              value={clubName}
              onChange={handleClubNameChange}
              placeholder="동아리 명"
              error={errors.clubName}
            />
          </FormField>

          <FormField label="동아리 로고">
            <ImageUpload onFileChange={(file) => setClubLogo(file)} />
          </FormField>

          <FormField label="동아리 한줄 소개">
            <TextInput
              value={clubIntro}
              onChange={handleClubIntroChange}
              placeholder="동아리 한줄 소개를 작성해주세요."
              error={errors.clubIntro}
            />
          </FormField>

          <FormField label="동아리 관련 링크" alignTop>
            <LinkInput links={clubLinks} onLinksChange={setClubLinks} />
          </FormField>

          <FormField label="동아리 소개 문구" alignTop>
            <TextArea
              value={clubIntroDetail}
              onChange={handleClubIntroDetailChange}
              placeholder="동아리 소개 문구를 작성해주세요."
              rows={12}
              error={errors.clubIntroDetail}
            />
          </FormField>

          <FormField label="동아리 전공" alignTop>
            <FieldSelector
              fields={FIELDS}
              selectedFields={selectedFields}
              onSelectionChange={handleFieldsChange}
              error={errors.selectedFields}
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-center py-16">
        <Button
          type="button"
          onClick={handleOpenModal}
          className="w-[500px] cursor-pointer rounded-lg bg-primary-500 py-6 font-medium text-[15px] text-white transition-colors hover:bg-primary-700 hover:text-gray-200"
        >
          개설 신청
        </Button>
      </div>

      <ApplicationConfirmModal
        isOpen={show}
        onClose={toggleShow}
        onConfirm={handleSubmit}
        onBackdropClick={toggleShow}
        title="정말 개설을 신청하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다."
        cancelText="닫기"
        confirmText="신청하기"
      />
    </div>
  );
}
