"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);
  const updateMyInfoMutation = useUpdateMyInfoMutation();
  const isSubmitting = updateMyInfoMutation.isPending;
  const isInitializedRef = useRef(false);
  const submitLockRef = useRef(false);

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [introduction, setIntroduction] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 페이지 이탈 방지
  useEffect(() => {
    // 입력이 시작되었거나 아직 제출하지 않은 경우 이탈 방지
    const hasAnyInput =
      profileFile !== null ||
      phone.trim() !== "" ||
      links.length > 0 ||
      selectedFields.length > 0 ||
      introduction.trim() !== "";

    const shouldPreventLeave = hasAnyInput && !isSubmitting;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldPreventLeave) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (shouldPreventLeave) {
        const target = e.target as HTMLElement;
        const link = target.closest("a");

        if (link?.href && !link.href.includes("/onboarding")) {
          e.preventDefault();
          e.stopPropagation();

          const confirmLeave = window.confirm(
            "입력한 내용이 저장되지 않습니다. 페이지를 떠나시겠습니까?",
          );

          if (confirmLeave) {
            router.push(new URL(link.href).pathname);
          }
        }
      }
    };

    if (shouldPreventLeave) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("click", handleClick, true);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, [
    profileFile,
    phone,
    links,
    selectedFields,
    introduction,
    isSubmitting,
    router,
  ]);

  const handleProfileChange = (
    file: File | null,
    _previewUrl: string | null,
  ) => {
    setProfileFile(file);
    if (errors.profile && file) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.profile;
        return newErrors;
      });
    }
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

  useEffect(() => {
    if (!userInfo || isInitializedRef.current) {
      return;
    }

    setPhone(formatPhoneNumber(userInfo.phoneNumber || ""));
    setLinks(
      (userInfo.link || [])
        .filter((url) => url.trim() !== "")
        .map((url, index) => ({
          id: `initial-link-${index}`,
          url,
        })),
    );

    setSelectedFields(userInfo.major || []);
    setIntroduction(userInfo.introduction || "");
    isInitializedRef.current = true;
  }, [userInfo]);

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhoneNumber(value));

    if (errors.phone && value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleLinksChange = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const hasExistingProfileImage = Boolean(userInfo?.profileImage?.trim());

    if (!profileFile && !hasExistingProfileImage) {
      newErrors.profile = "프로필 사진을 업로드해주세요";
    }
    if (phone.trim() && phone.replace(/-/g, "").length !== 11) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다";
    }
    if (selectedFields.length === 0) {
      newErrors.fields = "전공을 선택해주세요";
    }
    if (!introduction.trim()) {
      newErrors.introduction = "한줄 소개를 입력해주세요";
    } else if (introduction.length > 30) {
      newErrors.introduction = "한줄 소개는 30자 이하로 입력해주세요";
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
    if (value.length > 30) {
      toast.warning("한줄 소개는 30자까지 입력 가능합니다");
      return;
    }
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
    if (isSubmitting || submitLockRef.current) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const cleanedPhone = phone.replace(/-/g, "");
    const normalizedMajors = [...new Set(selectedFields)];
    const normalizedLinks = [
      ...new Set(links.map((link) => link.url.trim())),
    ].filter(Boolean);

    submitLockRef.current = true;
    updateMyInfoMutation.mutate(
      {
        introduction: introduction.trim(),
        phoneNumber: cleanedPhone || undefined,
        majors: normalizedMajors,
        links: normalizedLinks,
        profileImage: profileFile,
      },
      {
        onError: () => {
          submitLockRef.current = false;
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[70px] pb-30">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white">
        <h1 className="px-8 pt-8 font-bold text-2xl">필수 정보</h1>

        <div className="flex flex-col gap-2">
          <FormField label="프로필 사진" alignTop required>
            <ImageUpload
              onFileChange={handleProfileChange}
              placeholder="파일을 업로드 해주세요."
              defaultImageUrl={userInfo?.profileImage || null}
              error={errors.profile}
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
              onLinksChange={handleLinksChange}
              placeholder="링크 추가하기"
              error={errors.links}
              maxLinks={5}
              onMaxLimitReached={() => {
                toast.warning("링크는 최대 5개까지 추가할 수 있습니다");
              }}
            />
          </FormField>

          <FormField label="전화번호" required>
            <TextInput
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-xxxx-xxxx"
              error={errors.phone}
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
            disabled={isSubmitting}
            className="rounded-lg bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "저장 중..." : "저장 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
