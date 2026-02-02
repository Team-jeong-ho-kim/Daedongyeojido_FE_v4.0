"use client";

import { useState } from "react";
import { useUserStore } from "shared";
import { toast } from "sonner";
import {
  FieldSelector,
  FormField,
  ImageUpload,
  LinkInput,
  TextArea,
  TextInput,
} from "ui";
import { FIELDS } from "@/constants/club";
import { useUpdateMyInfoMutation } from "@/hooks/mutations/useUser";

interface LinkItem {
  id: string;
  url: string;
}

export default function OnboardingPage() {
  const userInfo = useUserStore((state) => state.userInfo);
  const updateMyInfoMutation = useUpdateMyInfoMutation();

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [introduction, setIntroduction] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileChange = (
    file: File | null,
    _previewUrl: string | null,
  ) => {
    setProfileFile(file);
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

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhoneNumber(value));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedFields.length === 0) {
      newErrors.fields = "전공을 선택해주세요";
    }
    if (!introduction.trim()) {
      newErrors.introduction = "한줄 소개를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldsChange = (fields: string[]) => {
    setSelectedFields(fields);
    if (errors.fields) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.fields;
        return newErrors;
      });
    }
  };

  const handleIntroductionChange = (value: string) => {
    setIntroduction(value);
    if (errors.introduction) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.introduction;
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }

    const cleanedPhone = phone.replace(/-/g, "");

    updateMyInfoMutation.mutate({
      introduction,
      phoneNumber: cleanedPhone || undefined,
      majors: selectedFields,
      links: links.map((link) => link.url),
      profileImage: profileFile,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[70px] pb-30">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white">
        <h1 className="px-8 pt-8 font-bold text-2xl">필수 정보</h1>

        <div className="flex flex-col gap-2">
          <FormField label="프로필 사진" alignTop>
            <ImageUpload
              onFileChange={handleProfileChange}
              placeholder="파일을 업로드 해주세요."
            />
          </FormField>

          <FormField label="이름">
            <TextInput
              value={userInfo?.userName || ""}
              onChange={() => {}}
              placeholder="이름을 입력해주세요."
              disabled
            />
          </FormField>

          <FormField label="학번">
            <TextInput
              value={userInfo?.classNumber || ""}
              onChange={() => {}}
              placeholder="학번을 입력해주세요."
              disabled
            />
          </FormField>

          <FormField label="관련 링크" alignTop>
            <LinkInput
              links={links}
              onLinksChange={setLinks}
              placeholder="링크 추가하기"
            />
          </FormField>

          <FormField label="전화번호">
            <TextInput
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-xxxx-xxxx"
            />
          </FormField>

          <FormField label="전공" alignTop required>
            <FieldSelector
              fields={FIELDS}
              selectedFields={selectedFields}
              onSelectionChange={handleFieldsChange}
              error={errors.fields}
            />
          </FormField>

          <FormField label="한줄 소개" alignTop required>
            <TextArea
              value={introduction}
              onChange={handleIntroductionChange}
              placeholder="한줄 소개를 입력해주세요!"
              autoResize={true}
              maxHeight={200}
              error={errors.introduction}
            />
          </FormField>
        </div>

        <div className="flex justify-end px-8 py-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800"
          >
            저장 완료
          </button>
        </div>
      </div>
    </div>
  );
}
