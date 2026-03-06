"use client";

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
import { useCreateClubApplicationMutation } from "@/hooks/mutations/useClub";
import { useModalStore } from "@/stores/useModalStore";

export default function ClubCreationPage() {
  const { mutate: createClubMutate } = useCreateClubApplicationMutation();
  const [clubName, setClubName] = useState("");
  const [clubLogo, setClubLogo] = useState<File | null>(null);
  const [clubCreationFormFile, setClubCreationFormFile] = useState<File | null>(
    null,
  );
  const [clubIntro, setClubIntro] = useState("");
  const [clubLinks, setClubLinks] = useState<{ id: string; url: string }[]>([]);
  const [clubIntroDetail, setClubIntroDetail] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const { show, toggleShow } = useModalStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clubName.trim()) {
      newErrors.clubName = "동아리 명을 입력해주세요";
    } else if (clubName.length > 20) {
      newErrors.clubName = "동아리 이름은 최대 20자까지 작성할 수 있습니다.";
    }
    if (!clubIntro.trim()) {
      newErrors.clubIntro = "동아리 한줄 소개를 입력해주세요";
    } else if (clubIntro.length > 30) {
      newErrors.clubIntro = "한줄 소개는 최대 30자까지 작성할 수 있습니다.";
    }
    if (!clubIntroDetail.trim()) {
      newErrors.clubIntroDetail = "동아리 소개 문구를 입력해주세요";
    } else if (clubIntroDetail.length > 500) {
      newErrors.clubIntroDetail =
        "동아리 소개는 최대 500자까지 작성할 수 있습니다.";
    }
    if (selectedFields.length === 0)
      newErrors.selectedFields = "동아리 전공을 선택해주세요";
    if (!clubCreationFormFile)
      newErrors.clubCreationFormFile =
        "작성한 동아리 개설 양식 파일을 업로드해주세요";

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
    if (value.length > 20) {
      toast.warning("동아리 이름은 20자까지 입력 가능합니다");
      return;
    }
    setClubName(value);
    if (value.trim()) clearError("clubName");
  };

  const handleClubIntroChange = (value: string) => {
    if (value.length > 30) {
      toast.warning("한줄 소개는 30자까지 입력 가능합니다");
      return;
    }
    setClubIntro(value);
    if (value.trim()) clearError("clubIntro");
  };

  const handleClubIntroDetailChange = (value: string) => {
    if (value.length > 500) {
      toast.warning("동아리 소개는 500자까지 입력 가능합니다");
      return;
    }
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
    if (!clubLogo) {
      toast.error("동아리 로고를 업로드해주세요.");
      toggleShow();
      return;
    }
    if (!clubCreationFormFile) {
      toast.error("작성한 동아리 개설 양식 파일을 업로드해주세요.");
      toggleShow();
      return;
    }

    const links = clubLinks.map((link) => link.url).filter((url) => url.trim());

    createClubMutate({
      clubName: clubName.trim(),
      oneLiner: clubIntro.trim(),
      introduction: clubIntroDetail.trim(),
      major: selectedFields,
      link: links,
      clubImage: clubLogo,
      clubCreationFormFile,
    });
    toggleShow();
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
              maxLength={20}
              error={errors.clubName}
            />
          </FormField>

          <FormField label="동아리 로고">
            <ImageUpload
              onFileChange={(file, _previewUrl) => setClubLogo(file)}
            />
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
              rows={8}
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

          <FormField label="동아리 개설 양식 파일" alignTop>
            <div className="space-y-2">
              <input
                type="file"
                accept=".hwp,.hwpx,.pdf,application/x-hwp,application/haansofthwp,application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  if (!file) {
                    setClubCreationFormFile(null);
                    return;
                  }

                  const lower = file.name.toLowerCase();
                  const isAllowed =
                    lower.endsWith(".hwp") ||
                    lower.endsWith(".hwpx") ||
                    lower.endsWith(".pdf");

                  if (!isAllowed) {
                    toast.error("HWP/HWPX/PDF 파일만 업로드할 수 있습니다.");
                    event.currentTarget.value = "";
                    setClubCreationFormFile(null);
                    return;
                  }

                  setClubCreationFormFile(file);
                  clearError("clubCreationFormFile");
                }}
                className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-gray-700 file:text-sm focus:border-primary-500"
              />
              <p className="text-gray-500 text-xs">
                작성 완료한 양식을 업로드해주세요. (HWP/HWPX/PDF)
              </p>
              {errors.clubCreationFormFile ? (
                <p className="text-red-500 text-xs">
                  {errors.clubCreationFormFile}
                </p>
              ) : null}
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
