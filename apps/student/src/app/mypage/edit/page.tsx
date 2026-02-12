"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "shared";
import { toast } from "sonner";
import { FieldSelector, ImageUpload, LinkInput, TextInput } from "ui";
import { FIELDS } from "@/constants/club";
import { useUpdateProfileMutation } from "@/hooks/mutations/useUser";

interface LinkItem {
  id: string;
  url: string;
}

export default function MyPageEdit() {
  const userInfo = useUserStore((state) => state.userInfo);
  const updateProfileMutation = useUpdateProfileMutation();
  const isSubmitting = updateProfileMutation.isPending;

  // 초기값 저장
  const initialLinks = useRef<string[]>([]);
  const initialMajors = useRef<string[]>([]);
  const initialIntroduction = useRef<string>("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [links, setLinks] = useState<LinkItem[]>(() => {
    if (Array.isArray(userInfo?.link)) {
      return userInfo.link.map((url) => ({ id: crypto.randomUUID(), url }));
    }
    return [];
  });
  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    if (Array.isArray(userInfo?.major)) {
      return userInfo.major;
    }
    return [];
  });
  const [introduction, setIntroduction] = useState(
    userInfo?.introduction || "",
  );

  // userInfo 변경 시 상태 업데이트
  useEffect(() => {
    if (userInfo) {
      // 초기값 저장
      initialLinks.current = Array.isArray(userInfo.link) ? userInfo.link : [];
      initialMajors.current = Array.isArray(userInfo.major)
        ? userInfo.major
        : [];
      initialIntroduction.current = userInfo.introduction || "";

      // 상태 업데이트
      setLinks(
        Array.isArray(userInfo.link)
          ? userInfo.link.map((url) => ({ id: crypto.randomUUID(), url }))
          : [],
      );
      setSelectedFields(Array.isArray(userInfo.major) ? userInfo.major : []);
      setIntroduction(userInfo.introduction || "");
    }
  }, [userInfo]);

  const handleImageChange = (file: File | null, _previewUrl: string | null) => {
    setProfileImage(file);
  };

  const handleIntroductionChange = (value: string) => {
    if (value.length > 30) {
      toast.warning("한줄 소개는 30자까지 입력 가능합니다");
      return;
    }
    setIntroduction(value);
  };

  const hasChanges = (): boolean => {
    // 프로필 이미지 변경
    if (profileImage !== null) return true;

    // 링크 변경 체크
    const currentLinks = links.map((link) => link.url);
    if (currentLinks.length !== initialLinks.current.length) return true;
    if (!currentLinks.every((url, idx) => url === initialLinks.current[idx])) {
      return true;
    }

    // 전공 변경 체크
    if (selectedFields.length !== initialMajors.current.length) return true;
    const sortedCurrent = [...selectedFields].sort();
    const sortedInitial = [...initialMajors.current].sort();
    if (!sortedCurrent.every((field, idx) => field === sortedInitial[idx])) {
      return true;
    }

    // 한줄 소개 변경 체크
    if (introduction !== initialIntroduction.current) return true;

    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges()) {
      toast.info("변경된 내용이 없습니다");
      return;
    }

    updateProfileMutation.mutate({
      introduction,
      majors: selectedFields,
      links: links.map((link) => link.url),
      profileImage,
      existingImageUrl: userInfo?.profileImage || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        {/* 상단 프로필 정보 */}
        <div className="mb-10 flex items-center gap-6">
          <Image
            src={userInfo?.profileImage || "/images/icons/profile.svg"}
            alt="프로필 이미지"
            className="h-18 w-18 rounded-full object-cover"
            width={72}
            height={72}
          />
          <div>
            <h2 className="mb-2 font-extrabold text-2xl tracking-tight">
              {userInfo?.userName}
            </h2>
            <p className="font-medium text-base text-gray-600">
              {userInfo?.clubName ?? "미소속"}
            </p>
          </div>
        </div>

        <div className="mb-12 h-px w-full bg-gray-200"></div>

        <h1 className="mb-12 font-extrabold text-3xl tracking-tight">
          인적 사항
        </h1>

        <form onSubmit={handleSubmit} className="relative space-y-8">
          {isSubmitting && (
            <div className="absolute inset-0 z-50 cursor-not-allowed bg-white/50" />
          )}
          <fieldset disabled={isSubmitting} className="space-y-8">
            {/* 프로필 사진 */}
            <div>
              <h2 className="mb-4 font-bold text-xl tracking-tight">
                프로필 사진
              </h2>
              <ImageUpload
                onFileChange={handleImageChange}
                defaultImageUrl={userInfo?.profileImage || null}
              />
            </div>

            <div className="h-px w-full bg-gray-200"></div>

            {/* 관련 링크 */}
            <div>
              <h2 className="mb-4 font-bold text-xl tracking-tight">
                관련 링크
              </h2>
              <LinkInput
                links={links}
                onLinksChange={setLinks}
                placeholder="링크 추가하기"
                maxLinks={5}
                onMaxLimitReached={() => {
                  toast.warning("링크는 최대 5개까지 추가할 수 있습니다");
                }}
              />
            </div>

            <div className="h-px w-full bg-gray-200"></div>

            {/* 전공 */}
            <div>
              <h2 className="mb-4 font-bold text-xl tracking-tight">전공</h2>
              <FieldSelector
                fields={FIELDS}
                selectedFields={selectedFields}
                onSelectionChange={setSelectedFields}
              />
            </div>

            <div className="h-px w-full bg-gray-200"></div>

            {/* 한줄 소개 */}
            <div>
              <h2 className="mb-4 font-bold text-xl tracking-tight">
                한줄 소개
              </h2>
              <TextInput
                value={introduction}
                onChange={handleIntroductionChange}
                placeholder="한 줄 소개 문구를 입력해주세요."
                maxLength={30}
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gray-400 px-8 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-gray-500 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "변경 중..." : "변경 하기"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
