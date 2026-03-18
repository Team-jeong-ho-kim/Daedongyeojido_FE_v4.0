"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Button,
  ErrorMessage,
  FieldSelector,
  FormField,
  ImageUpload,
  LinkInput,
  ManualPdfPreviewModal,
  TextArea,
  TextInput,
} from "ui";
import { getDocumentDownloadFileName, getDocumentFileExtensionLabel } from "utils";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import { FIELDS } from "@/constants/club";
import {
  useSubmitClubCreationApplicationMutation,
  useUpdateClubCreationApplicationMutation,
} from "@/hooks/mutations";
import { useGetMyClubCreationApplicationQuery } from "@/hooks/querys";
import { useModalStore } from "@/stores/useModalStore";

export default function EditClubCreationApplicationPage() {
  const router = useRouter();
  const { show, toggleShow } = useModalStore();
  const applicationQuery = useGetMyClubCreationApplicationQuery();
  const updateMutation = useUpdateClubCreationApplicationMutation();
  const submitMutation = useSubmitClubCreationApplicationMutation();
  const hasInitializedRef = useRef(false);
  const shouldRedirectToDetailRef = useRef(true);

  const [clubName, setClubName] = useState("");
  const [clubLogo, setClubLogo] = useState<File | null>(null);
  const [clubCreationFormFile, setClubCreationFormFile] = useState<File | null>(
    null,
  );
  const [clubCreationFormPreviewUrl, setClubCreationFormPreviewUrl] = useState<
    string | null
  >(null);
  const [clubIntro, setClubIntro] = useState("");
  const [clubLinks, setClubLinks] = useState<{ id: string; url: string }[]>([]);
  const [clubIntroDetail, setClubIntroDetail] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (
      shouldRedirectToDetailRef.current &&
      applicationQuery.data &&
      applicationQuery.data.status !== "CHANGES_REQUESTED"
    ) {
      router.replace("/mypage/club-creation");
    }
  }, [applicationQuery.data, router]);

  useEffect(() => {
    if (!applicationQuery.data || hasInitializedRef.current) {
      return;
    }

    setClubName(applicationQuery.data.clubName);
    setClubIntro(applicationQuery.data.oneLiner);
    setClubIntroDetail(applicationQuery.data.introduction);
    setSelectedFields(applicationQuery.data.majors);
    setClubLinks(
      applicationQuery.data.links.map((url) => ({
        id: crypto.randomUUID(),
        url,
      })),
    );
    hasInitializedRef.current = true;
  }, [applicationQuery.data]);

  useEffect(() => {
    if (!clubCreationFormFile) {
      setClubCreationFormPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return null;
      });
      setIsPreviewOpen(false);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(clubCreationFormFile);

    setClubCreationFormPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return nextPreviewUrl;
    });
    setIsPreviewOpen(false);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [clubCreationFormFile]);

  const application = applicationQuery.data;
  const existingClubCreationFormUrl = application?.clubCreationForm ?? null;
  const previewSource = clubCreationFormPreviewUrl ?? existingClubCreationFormUrl;
  const previewFileName = clubCreationFormFile
    ? getDocumentDownloadFileName(
        clubCreationFormFile.name,
        clubCreationFormFile.name,
        clubCreationFormFile.type,
      )
    : previewSource
      ? getDocumentDownloadFileName(
          `${application?.clubName ?? "개설 신청"} 개설 신청 양식`,
          previewSource,
        )
      : "";
  const previewFileExtensionLabel = clubCreationFormFile
    ? getDocumentFileExtensionLabel(
        clubCreationFormFile.name,
        clubCreationFormFile.name,
        clubCreationFormFile.type,
      )
    : previewSource
      ? getDocumentFileExtensionLabel(
          `${application?.clubName ?? "개설 신청"} 개설 신청 양식`,
          previewSource,
        )
      : "PDF";

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!clubName.trim()) {
      nextErrors.clubName = "동아리 명을 입력해주세요";
    } else if (clubName.length > 20) {
      nextErrors.clubName = "동아리 이름은 최대 20자까지 작성할 수 있습니다.";
    }
    if (!clubIntro.trim()) {
      nextErrors.clubIntro = "동아리 한줄 소개를 입력해주세요";
    } else if (clubIntro.length > 30) {
      nextErrors.clubIntro = "한줄 소개는 최대 30자까지 작성할 수 있습니다.";
    }
    if (!clubIntroDetail.trim()) {
      nextErrors.clubIntroDetail = "동아리 소개 문구를 입력해주세요";
    } else if (clubIntroDetail.length > 500) {
      nextErrors.clubIntroDetail =
        "동아리 소개는 최대 500자까지 작성할 수 있습니다.";
    }
    if (selectedFields.length === 0) {
      nextErrors.selectedFields = "동아리 전공을 선택해주세요";
    }
    if (!clubCreationFormFile && !existingClubCreationFormUrl) {
      nextErrors.clubCreationFormFile =
        "작성한 동아리 개설 양식 파일을 업로드해주세요";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const nextErrors = { ...prev };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const handleOpenModal = () => {
    if (validateForm()) {
      toggleShow();
    } else {
      toast.error("필수 항목을 모두 입력해주세요");
    }
  };

  const handleSubmit = async () => {
    if (!application) {
      return;
    }

    if (!clubCreationFormFile && !existingClubCreationFormUrl) {
      toast.error("작성한 동아리 개설 양식 파일을 업로드해주세요.");
      toggleShow();
      return;
    }

    const normalizedLinks = [...new Set(clubLinks.map((link) => link.url.trim()))].filter(
      Boolean,
    );

    try {
      shouldRedirectToDetailRef.current = false;
      await updateMutation.mutateAsync({
        applicationId: application.applicationId,
        clubName: clubName.trim(),
        oneLiner: clubIntro.trim(),
        introduction: clubIntroDetail.trim(),
        major: selectedFields,
        link: normalizedLinks,
        clubImage: clubLogo ?? undefined,
        clubCreationForm: clubCreationFormFile ?? undefined,
      });
      await submitMutation.mutateAsync(application.applicationId);
    } finally {
      toggleShow();
    }
  };

  if (applicationQuery.isPending || !application || !hasInitializedRef.current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-gray-500 text-sm">
          수정할 개설 신청 정보를 불러오고 있습니다...
        </p>
      </div>
    );
  }

  if (applicationQuery.isError || application.status !== "CHANGES_REQUESTED") {
    return (
      <div className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-gray-50 px-8 py-10 text-center">
          <h1 className="font-bold text-3xl text-gray-900">
            수정 가능한 개설 신청이 없습니다
          </h1>
          <p className="mt-4 text-gray-500 text-sm leading-6">
            수정 요청 상태의 개설 신청만 이 화면에서 다시 제출할 수 있습니다.
          </p>
          <Link
            href="/mypage/club-creation"
            className="mt-8 inline-flex rounded-xl bg-primary-500 px-6 py-3 font-semibold text-sm text-white transition hover:bg-primary-600"
          >
            내 개설 신청으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
            <Link href="/mypage" className="hover:text-gray-600">
              마이페이지
            </Link>
            <span>&gt;</span>
            <Link href="/mypage/club-creation" className="hover:text-gray-600">
              내 개설 신청
            </Link>
            <span>&gt;</span>
            <span className="text-gray-600">수정 후 재제출</span>
          </div>

          <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 px-6 py-6">
            <h1 className="font-bold text-2xl text-gray-900">
              수정 요청 코멘트를 반영해 신청서를 다시 제출하세요
            </h1>
            <p className="mt-3 text-gray-600 text-sm leading-7">
              현재 revision {application.revision}에 대한 리뷰를 반영한 뒤
              재제출하면 검토 상태가 다시 갱신됩니다.
            </p>
          </div>

          <FormField label="동아리 명">
            <TextInput
              value={clubName}
              onChange={(value) => {
                if (value.length > 20) {
                  toast.warning("동아리 이름은 20자까지 입력 가능합니다");
                  return;
                }
                setClubName(value);
                if (value.trim()) clearError("clubName");
              }}
              placeholder="동아리 명"
              maxLength={20}
              error={errors.clubName}
            />
          </FormField>

          <FormField label="동아리 로고">
            <ImageUpload
              defaultImageUrl={application.clubImage}
              onFileChange={(file, _previewUrl) => setClubLogo(file)}
            />
          </FormField>

          <FormField label="동아리 한줄 소개">
            <TextInput
              value={clubIntro}
              onChange={(value) => {
                if (value.length > 30) {
                  toast.warning("한줄 소개는 30자까지 입력 가능합니다");
                  return;
                }
                setClubIntro(value);
                if (value.trim()) clearError("clubIntro");
              }}
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
              onChange={(value) => {
                if (value.length > 500) {
                  toast.warning("동아리 소개는 500자까지 입력 가능합니다");
                  return;
                }
                setClubIntroDetail(value);
                if (value.trim()) clearError("clubIntroDetail");
              }}
              placeholder="동아리 소개 문구를 작성해주세요."
              rows={8}
              error={errors.clubIntroDetail}
            />
          </FormField>

          <FormField label="동아리 전공" alignTop>
            <FieldSelector
              fields={FIELDS}
              selectedFields={selectedFields}
              onSelectionChange={(fields) => {
                setSelectedFields(fields);
                if (fields.length > 0) clearError("selectedFields");
              }}
              error={errors.selectedFields}
            />
          </FormField>

          <FormField label="동아리 개설 양식 파일" alignTop>
            <div className="space-y-2">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  if (!file) {
                    setClubCreationFormFile(null);
                    return;
                  }

                  if (!file.name.toLowerCase().endsWith(".pdf")) {
                    toast.error("PDF 파일만 업로드할 수 있습니다.");
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
                새 PDF를 올리면 기존 파일을 대체합니다. 업로드하지 않으면 기존
                파일을 유지합니다.
              </p>
              {previewSource ? (
                <article className="rounded-xl border border-gray-200 bg-white px-4 py-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white font-semibold text-[11px] text-gray-700">
                        {previewFileExtensionLabel}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-all font-medium text-gray-900 text-sm md:text-base">
                          {previewFileName}
                        </p>
                        <p className="mt-1 text-[12px] text-gray-500">
                          {clubCreationFormFile
                            ? "새로 업로드한 개설 양식"
                            : "기존에 제출한 개설 양식"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50"
                    >
                      미리보기
                    </button>
                  </div>
                </article>
              ) : null}
              <ErrorMessage message={errors.clubCreationFormFile} />
            </div>
          </FormField>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-5 py-5 text-gray-600 text-sm leading-7">
            지도 교사 매칭 정보는 수정할 수 없습니다. 수정 요청 코멘트와 신청서
            내용만 반영한 뒤 다시 제출해 주세요.
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 py-16">
        <Link
          href="/mypage/club-creation"
          className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-sm text-gray-700 transition hover:bg-gray-50"
        >
          취소
        </Link>
        <Button
          type="button"
          disabled={updateMutation.isPending || submitMutation.isPending}
          onClick={handleOpenModal}
          className="rounded-xl bg-primary-500 px-8 py-3 font-semibold text-sm text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updateMutation.isPending || submitMutation.isPending
            ? "재제출 중..."
            : "수정 후 다시 제출"}
        </Button>
      </div>

      <ApplicationConfirmModal
        isOpen={show}
        onClose={toggleShow}
        onConfirm={handleSubmit}
        onBackdropClick={toggleShow}
        title="수정한 내용을 다시 제출하시겠습니까?"
        description="저장 후 즉시 재제출되며 검토 상태가 다시 갱신됩니다."
        cancelText="닫기"
        confirmText="다시 제출하기"
      />

      <ManualPdfPreviewModal
        fileName={previewFileName}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfPath={previewSource}
      />
    </div>
  );
}
