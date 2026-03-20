"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useUserStore } from "shared";
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
import {
  ApiError,
  getDocumentDownloadFileName,
  getDocumentFileExtensionLabel,
  getSessionUser,
} from "utils";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";
import { FIELDS } from "@/constants/club";
import { useCreateClubCreationApplicationMutation } from "@/hooks/mutations";
import {
  useGetAllTeachersQuery,
  useGetMyClubCreationApplicationQuery,
} from "@/hooks/querys";
import { useModalStore } from "@/stores/useModalStore";
import type { Teacher } from "@/types";

type TeacherSelectFieldProps = {
  disabled?: boolean;
  error?: string;
  emptyText: string;
  onSelect: (teacherId: number | null) => void;
  options: Teacher[];
  selectedTeacherId: number | null;
};

function TeacherSelectField(props: TeacherSelectFieldProps) {
  const {
    disabled = false,
    emptyText,
    error,
    onSelect,
    options,
    selectedTeacherId,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const selectedTeacher =
    options.find((option) => option.teacherId === selectedTeacherId) ?? null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <div ref={containerRef} className="w-full">
      <button
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        disabled={disabled}
        className={`w-full rounded-xl border px-5 py-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-100 ${
          error
            ? "border-red-300 bg-red-50/40"
            : selectedTeacher
              ? "border-gray-200 bg-white hover:border-primary-200"
              : "border-gray-200 bg-white hover:border-primary-200 hover:bg-gray-50"
        } ${
          disabled
            ? "cursor-not-allowed text-gray-400 hover:border-gray-200 hover:bg-white"
            : ""
        }`}
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => !prev);
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-medium text-[13px] text-gray-400 uppercase tracking-[0.08em]">
              Teacher
            </p>
            <p
              className={`mt-2 truncate font-semibold text-[16px] ${
                selectedTeacher
                  ? "text-gray-900"
                  : disabled
                    ? "text-gray-400"
                    : "text-gray-500"
              }`}
            >
              {selectedTeacher?.teacherName ?? emptyText}
            </p>
          </div>

          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
              isOpen && !disabled ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6 9 6 6 6-6"
            />
          </svg>
        </div>
      </button>

      {isOpen ? (
        <fieldset
          id={panelId}
          className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
        >
          <legend className="sr-only">지도 교사 목록</legend>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {options.map((option) => {
              const isSelected = option.teacherId === selectedTeacherId;
              const isMatched = option.matched;

              return (
                <button
                  key={option.teacherId}
                  type="button"
                  aria-pressed={isSelected}
                  aria-disabled={isMatched}
                  onClick={() => {
                    if (isMatched) {
                      toast.error("이미 매칭된 지도교사는 선택할 수 없습니다.");
                      return;
                    }
                    onSelect(isSelected ? null : option.teacherId);
                    setIsOpen(false);
                  }}
                  className={`flex min-h-[72px] items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-100 ${
                    isMatched
                      ? "cursor-not-allowed border-red-200 bg-red-50/40 hover:border-red-300"
                      : isSelected
                        ? "border-primary-300 bg-white"
                        : "border-gray-200 bg-white hover:border-primary-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-[15px] text-gray-900">
                        {option.teacherName}
                      </p>
                      {isMatched ? (
                        <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 font-semibold text-[11px] text-red-700">
                          매칭됨
                        </span>
                      ) : null}
                    </div>
                    <p
                      className={`mt-1 text-[12px] ${
                        isMatched
                          ? "text-red-600"
                          : isSelected
                            ? "text-primary-600"
                            : "text-gray-500"
                      }`}
                    >
                      {isMatched ? "선택 불가" : "지도 교사"}
                    </p>
                  </div>

                  {isMatched ? null : (
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        isSelected
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-gray-300 bg-white text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      <span className="font-bold text-[11px] leading-none">
                        ✓
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <ErrorMessage message={error} />
    </div>
  );
}

const getErrorStatus = (error: unknown): number | null => {
  if (error instanceof ApiError) {
    return error.status;
  }

  if (!error || typeof error !== "object") {
    return null;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  if (
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "status" in error.response &&
    typeof error.response.status === "number"
  ) {
    return error.response.status;
  }

  return null;
};

export default function ClubCreationPage() {
  const router = useRouter();
  const storeRole = useUserStore((state) => state.userInfo?.role);
  const role = storeRole ?? getSessionUser()?.role ?? null;
  const isBlockedRole = role === "CLUB_MEMBER" || role === "CLUB_LEADER";
  const shouldRedirectToDetailRef = useRef(true);
  const { mutate: createClubMutate, isPending: isCreatePending } =
    useCreateClubCreationApplicationMutation();
  const myApplicationQuery = useGetMyClubCreationApplicationQuery({
    enabled: role !== null && !isBlockedRole,
  });
  const teachersQuery = useGetAllTeachersQuery({
    enabled: role !== null && !isBlockedRole,
  });
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
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null,
  );
  const [isClubCreationPreviewOpen, setIsClubCreationPreviewOpen] =
    useState(false);
  const { show, toggleShow } = useModalStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const teachers = teachersQuery.data ?? [];
  const selectableTeachers = teachers.filter((teacher) => !teacher.matched);
  const myApplicationErrorStatus = getErrorStatus(myApplicationQuery.error);
  const isTeacherSelectDisabled =
    teachersQuery.isPending || teachersQuery.isError || teachers.length === 0;

  useEffect(() => {
    if (shouldRedirectToDetailRef.current && myApplicationQuery.data) {
      router.replace("/mypage/club-creation");
    }
  }, [myApplicationQuery.data, router]);

  useEffect(() => {
    if (selectedTeacherId === null) {
      return;
    }

    const selectedTeacher = teachers.find(
      (teacher) => teacher.teacherId === selectedTeacherId,
    );

    if (!selectedTeacher || selectedTeacher.matched) {
      setSelectedTeacherId(null);
    }
  }, [selectedTeacherId, teachers]);

  useEffect(() => {
    if (!clubCreationFormFile) {
      setClubCreationFormPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return null;
      });
      setIsClubCreationPreviewOpen(false);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(clubCreationFormFile);

    setClubCreationFormPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return nextPreviewUrl;
    });

    setIsClubCreationPreviewOpen(false);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [clubCreationFormFile]);

  const getTeacherFieldText = () => {
    if (teachersQuery.isPending) {
      return "지도 교사 목록을 불러오는 중입니다";
    }
    if (teachersQuery.isError) {
      return "지도 교사 목록을 불러오지 못했습니다";
    }
    if (teachers.length === 0 || selectableTeachers.length === 0) {
      return "선택 가능한 지도 교사가 없습니다";
    }
    return "지도 교사를 선택해주세요";
  };

  const getTeacherValidationMessage = () => {
    if (teachersQuery.isPending) {
      return "지도 교사 목록을 불러오는 중입니다. 잠시 후 다시 시도해주세요.";
    }
    if (teachersQuery.isError) {
      return "지도 교사 목록을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.";
    }
    if (teachers.length === 0 || selectableTeachers.length === 0) {
      return "선택 가능한 지도 교사가 없습니다. 관리자에게 문의해주세요.";
    }
    return "지도 교사를 선택해주세요";
  };

  const clubCreationFormDisplayName = clubCreationFormFile
    ? getDocumentDownloadFileName(
        clubCreationFormFile.name,
        clubCreationFormFile.name,
        clubCreationFormFile.type,
      )
    : "";
  const clubCreationFormExtensionLabel = clubCreationFormFile
    ? getDocumentFileExtensionLabel(
        clubCreationFormFile.name,
        clubCreationFormFile.name,
        clubCreationFormFile.type,
      )
    : "PDF";

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
    if (selectedFields.length === 0) {
      newErrors.selectedFields = "동아리 전공을 선택해주세요";
    }
    if (!clubCreationFormFile) {
      newErrors.clubCreationFormFile =
        "작성한 동아리 개설 양식 파일을 업로드해주세요";
    }
    if (selectedTeacherId === null) {
      newErrors.selectedTeacherId = getTeacherValidationMessage();
    }

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

  const handleTeacherSelect = (teacherId: number | null) => {
    setSelectedTeacherId(teacherId);
    if (teacherId !== null) {
      clearError("selectedTeacherId");
    }
  };

  const handleOpenModal = () => {
    if (validateForm()) {
      toggleShow();
    } else {
      toast.error("필수 항목을 모두 입력해주세요");
    }
  };

  const handleSubmit = () => {
    if (!clubCreationFormFile) {
      toast.error("작성한 동아리 개설 양식 파일을 업로드해주세요.");
      toggleShow();
      return;
    }
    if (selectedTeacherId === null) {
      toast.error(getTeacherValidationMessage());
      toggleShow();
      return;
    }

    const links = [...new Set(clubLinks.map((link) => link.url.trim()))].filter(
      Boolean,
    );

    shouldRedirectToDetailRef.current = false;
    createClubMutate({
      clubName: clubName.trim(),
      oneLiner: clubIntro.trim(),
      introduction: clubIntroDetail.trim(),
      teacherId: selectedTeacherId,
      major: selectedFields,
      link: links,
      clubImage: clubLogo ?? undefined,
      clubCreationForm: clubCreationFormFile,
    });
    toggleShow();
  };

  if (isBlockedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center shadow-sm">
          <h1 className="font-bold text-gray-900 text-xl">
            새 동아리 개설 신청을 진행할 수 없습니다
          </h1>
          <p className="mt-3 text-gray-600 text-sm leading-6">
            동아리원 및 동아리 리더는 현재 소속 동아리 활동 중인 상태이므로 새
            동아리 개설 신청 대상이 아닙니다.
          </p>
          <button
            type="button"
            onClick={() => router.push("/mypage/club-creation")}
            className="mt-6 rounded-xl bg-primary-500 px-5 py-3 font-semibold text-sm text-white transition hover:bg-primary-600"
          >
            마이페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  if (myApplicationQuery.isPending || myApplicationQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-gray-500 text-sm">
          내 개설 신청 상태를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  if (myApplicationQuery.error && myApplicationErrorStatus !== 404) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center">
          <h1 className="font-bold text-gray-900 text-xl">
            개설 신청 화면을 열 수 없습니다
          </h1>
          <p className="mt-3 text-gray-600 text-sm leading-6">
            내 개설 신청 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-primary-500 px-5 py-3 font-semibold text-sm text-white transition hover:bg-primary-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 min-h-screen bg-white">
      <div className="bg-gray-50 py-16">
        <h1 className="mb-3 text-center font-bold text-[26px]">
          동아리 개설 신청
        </h1>
        <p className="mb-12 text-center text-gray-500 text-sm">
          지도 교사를 먼저 선택하고, 개설 신청서를 작성해 제출하세요.
        </p>

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
                accept=".pdf,application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  if (!file) {
                    setClubCreationFormFile(null);
                    return;
                  }

                  const lower = file.name.toLowerCase();
                  const isAllowed = lower.endsWith(".pdf");

                  if (!isAllowed) {
                    toast.error("PDF 파일만 업로드할 수 있습니다.");
                    event.currentTarget.value = "";
                    setClubCreationFormFile(null);
                    setIsClubCreationPreviewOpen(false);
                    return;
                  }

                  setClubCreationFormFile(file);
                  clearError("clubCreationFormFile");
                }}
                className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-gray-700 file:text-sm focus:border-primary-500"
              />
              <p className="text-gray-500 text-xs">
                작성 완료한 양식을 업로드해주세요. (PDF)
              </p>
              {clubCreationFormFile ? (
                <article
                  aria-label="업로드한 개설 양식"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white font-semibold text-[11px] text-gray-700">
                        {clubCreationFormExtensionLabel}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-all font-medium text-gray-900 text-sm md:text-base">
                          {clubCreationFormDisplayName}
                        </p>
                        <p className="mt-1 text-[12px] text-gray-500">
                          업로드한 개설 양식
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {clubCreationFormPreviewUrl ? (
                        <button
                          type="button"
                          onClick={() => setIsClubCreationPreviewOpen(true)}
                          className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50"
                        >
                          미리보기
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ) : null}
              <ErrorMessage message={errors.clubCreationFormFile} />
            </div>
          </FormField>

          <FormField label="지도 교사 선택" alignTop>
            <TeacherSelectField
              disabled={isTeacherSelectDisabled}
              emptyText={getTeacherFieldText()}
              error={errors.selectedTeacherId}
              onSelect={handleTeacherSelect}
              options={teachers}
              selectedTeacherId={selectedTeacherId}
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-center py-16">
        <Button
          type="button"
          disabled={isCreatePending}
          onClick={handleOpenModal}
          className="w-[500px] cursor-pointer rounded-lg bg-primary-500 py-6 font-medium text-[15px] text-white transition-colors hover:bg-primary-700 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreatePending ? "신청 중..." : "개설 신청"}
        </Button>
      </div>

      <ApplicationConfirmModal
        isOpen={show}
        onClose={toggleShow}
        onConfirm={handleSubmit}
        onBackdropClick={toggleShow}
        title="정말 개설을 신청하시겠습니까?"
        description="제출 후에는 내 신청 상세 화면에서 상태를 확인할 수 있습니다."
        cancelText="닫기"
        confirmText="신청하기"
      />

      <ManualPdfPreviewModal
        fileName={clubCreationFormDisplayName}
        isOpen={isClubCreationPreviewOpen}
        onClose={() => setIsClubCreationPreviewOpen(false)}
        pdfPath={clubCreationFormPreviewUrl}
      />
    </div>
  );
}
